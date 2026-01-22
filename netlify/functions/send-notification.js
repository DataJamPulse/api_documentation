// Netlify Serverless Function - Send Email Notification via Resend
// Sends notification when someone accesses the API docs

exports.handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { email, userAgent } = JSON.parse(event.body);

        if (!email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email required' })
            };
        }

        // Get Resend API key from environment
        const RESEND_API_KEY = process.env.RESEND_API_KEY;

        if (!RESEND_API_KEY) {
            console.error('RESEND_API_KEY not configured');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Email service not configured' })
            };
        }

        // Format the notification email
        const timestamp = new Date().toLocaleString('en-GB', {
            timeZone: 'Europe/London',
            dateStyle: 'full',
            timeStyle: 'short'
        });

        const emailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #E62F6E, #E94B52); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">New API Docs Visitor</h1>
                </div>
                <div style="background: #0A0C11; color: #FEFAF9; padding: 30px;">
                    <p style="font-size: 16px; margin-bottom: 20px;">Someone just accessed the Data Jam API Documentation:</p>

                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #333; color: #E62F6E; font-weight: bold;">Email</td>
                            <td style="padding: 10px; border-bottom: 1px solid #333;">${email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #333; color: #E62F6E; font-weight: bold;">Time</td>
                            <td style="padding: 10px; border-bottom: 1px solid #333;">${timestamp}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #333; color: #E62F6E; font-weight: bold;">Browser</td>
                            <td style="padding: 10px; border-bottom: 1px solid #333; font-size: 12px;">${userAgent || 'Unknown'}</td>
                        </tr>
                    </table>

                    <p style="margin-top: 30px; font-size: 14px; opacity: 0.7;">
                        View all visitors in your <a href="https://supabase.com/dashboard" style="color: #15E0BC;">Supabase Dashboard</a>
                    </p>
                </div>
                <div style="background: #1a1a1a; padding: 15px; text-align: center;">
                    <p style="color: #666; font-size: 12px; margin: 0;">Data Jam API Documentation Notifications</p>
                </div>
            </div>
        `;

        // Send via Resend API
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'API ACCESS ALERT <leads@data-jam.com>',
                to: ['arran@data-jam.com', 'rhea@data-jam.com'],
                subject: `New API Docs Visitor: ${email}`,
                html: emailBody
            })
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Resend error:', result);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to send notification' })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, id: result.id })
        };

    } catch (error) {
        console.error('Notification error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
