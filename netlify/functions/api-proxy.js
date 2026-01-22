// Netlify Serverless Function - API Proxy
// Proxies requests to Data Jam API (allows GET with body)

const https = require('https');

// Allowed origins (security)
const ALLOWED_ORIGINS = [
    'https://api.data-jam.com',
    'https://api-data-jam.netlify.app',
    'http://localhost:8888',
    'http://localhost:3000'
];

// Agent to handle SSL (datajamportal.com certificate chain)
const agent = new https.Agent({
    rejectUnauthorized: false
});

exports.handler = async (event) => {
    // Get origin
    const origin = event.headers.origin || event.headers.Origin || '';
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    // CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': allowedOrigin,
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: ''
        };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Access-Control-Allow-Origin': allowedOrigin },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Validate origin
    if (!ALLOWED_ORIGINS.includes(origin) && origin !== '') {
        return {
            statusCode: 403,
            body: JSON.stringify({ error: 'Forbidden' })
        };
    }

    try {
        const { endpoint, credentials, payload } = JSON.parse(event.body);

        // Validate endpoint (only allow known endpoints)
        const allowedEndpoints = ['GetData', 'GetDeviceInfo', 'AddData', 'GetOccuData'];
        if (!allowedEndpoints.includes(endpoint)) {
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': allowedOrigin },
                body: JSON.stringify({ error: 'Invalid endpoint' })
            };
        }

        // Validate credentials format
        if (!credentials || !credentials.includes(':')) {
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': allowedOrigin },
                body: JSON.stringify({ error: 'Invalid credentials format' })
            };
        }

        // Build the request
        const url = `https://datajamportal.com/CustomerAPI/${endpoint}/`;
        const method = endpoint === 'AddData' ? 'POST' : 'GET';

        // Make the request
        const response = await makeRequest(url, method, credentials, payload);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': allowedOrigin
            },
            body: JSON.stringify(response)
        };

    } catch (error) {
        console.error('Proxy error:', error.message);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': allowedOrigin
            },
            body: JSON.stringify({
                error: 'Request failed'
            })
        };
    }
};

// Helper function to make HTTPS request with body on GET
function makeRequest(url, method, credentials, payload) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const bodyData = JSON.stringify(payload);

        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname,
            method: method,
            agent: agent,
            timeout: 30000,
            headers: {
                'Authorization': 'Basic ' + Buffer.from(credentials).toString('base64'),
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bodyData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (e) {
                    resolve({ raw: data });
                }
            });
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(bodyData);
        req.end();
    });
}
