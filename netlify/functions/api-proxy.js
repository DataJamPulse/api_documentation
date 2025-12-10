// Netlify Serverless Function - API Proxy
// Proxies requests to Data Jam API (allows GET with body)

const https = require('https');

// Agent to handle SSL (datajamportal.com certificate chain)
const agent = new https.Agent({
    rejectUnauthorized: false
});

exports.handler = async (event) => {
    // Only allow POST from our frontend (we convert to GET on backend)
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { endpoint, credentials, payload } = JSON.parse(event.body);

        // Validate endpoint (only allow our known endpoints)
        const allowedEndpoints = ['GetData', 'GetDeviceInfo', 'AddData'];
        if (!allowedEndpoints.includes(endpoint)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid endpoint' })
            };
        }

        // Build the request
        const url = `https://datajamportal.com/CustomerAPI/${endpoint}/`;
        const method = endpoint === 'AddData' ? 'POST' : 'GET';

        // Make the request using https module (supports GET with body)
        const response = await makeRequest(url, method, credentials, payload);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(response)
        };

    } catch (error) {
        console.error('Proxy error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Proxy request failed',
                details: error.message
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

        req.on('error', (error) => {
            reject(error);
        });

        // Write body data
        req.write(bodyData);
        req.end();
    });
}
