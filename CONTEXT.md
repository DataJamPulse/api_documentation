# Data Jam API Documentation Project

## Overview
This project contains the API documentation for Data Jam's Customer API, deployed to **api.data-jam.com**.

**Version**: 2.0
**Last Updated**: December 2024

## What is Data Jam?
Data Jam is an OOH (Out-of-Home) advertising analytics platform that uses JamBox sensors to capture real-time impressions, movement data, dwell time, and visitor analytics for advertising locations.

## Live Site
- **URL**: https://api.data-jam.com
- **Hosting**: Netlify (auto-deploy from GitHub)
- **GitHub Repo**: https://github.com/DataJamPulse/api_documentation
- **Netlify Site ID**: `52e18928-8eca-4cc7-9847-b4e20d321858`
- **Netlify Site Name**: `jocular-tulumba-3592b1`

## Deployment
Auto-deploys from GitHub on push. For manual deploy:
```bash
cd /Users/jav/Desktop/DATAJAM/api-docs-deploy
netlify deploy --prod
```

Or if folder moves, re-link first:
```bash
netlify link --id 52e18928-8eca-4cc7-9847-b4e20d321858
netlify deploy --prod
```

## Project Structure
```
api-docs-deploy/
├── index.html                      # Main API documentation page
├── logo-gradient.png               # Data Jam gradient logo
├── datajam_logo.png                # Data Jam logo (legacy)
├── icons/                          # Section icons (SVG)
│   ├── book.svg
│   ├── coding.svg
│   ├── download.svg
│   ├── energy.svg
│   ├── help.svg
│   ├── key.svg
│   ├── mailing.svg
│   ├── play.svg
│   ├── protected.svg
│   ├── settings.svg
│   ├── statistics.svg
│   ├── time.svg
│   └── transfer.svg
├── netlify/
│   └── functions/
│       └── api-proxy.js            # Serverless proxy for API sandbox
├── .gitignore
└── CONTEXT.md                      # This file
```

## Key Features

### Interactive API Sandbox
- Live API testing directly in the browser
- Supports GetData and GetDeviceInfo endpoints
- Uses serverless proxy function to handle requests
- Users authenticate with their own Data Jam Portal credentials

### Documentation Sections
1. Quick Start
2. Try It Live (Sandbox)
3. Authentication
4. API Endpoints
5. Data Types
6. Request Format
7. Response Format
8. Rate Limits
9. Postman Setup
10. Code Examples (cURL, Python, Node.js)
11. FAQ
12. Support

### UI Features
- Sidebar navigation (hamburger menu)
- Search functionality (press `/`)
- Copy buttons on code blocks
- Responsive design

## API Base URL
```
https://datajamportal.com/CustomerAPI/
```

## API Endpoints

### 1. GetData (GET)
Retrieves impressions, movement data, dwell time, or visitor analytics.
- **URL**: `/CustomerAPI/GetData/`
- **Auth**: HTTP Basic Auth (Portal credentials)
- **Data Types**:
  - `Impression` - Total impressions/views
  - `Visitors` - Unique visitor counts
  - `DwellTime` - Time spent in detection zone
  - `UserData` - Custom user-submitted data
- **Filter Options**: `All` (zone breakdowns) or `Default` (aggregated totals)
- **Constraint**: Max 30-day date range per request

### 2. GetDeviceInfo (GET)
Retrieves device configuration and metadata including geolocation.
- **URL**: `/CustomerAPI/GetDeviceInfo/`
- **Returns**: device_number, device_status, latitude, longitude, timezone, dev_location_ref, dev_frameid, mac_address, min_rssi

### 3. AddData (POST)
Submit custom user data for external data integration.
- **URL**: `/CustomerAPI/AddData/`
- **Use case**: Integrate sales, weather, event, or other external data
- **Required fields**: project_name, device_number, timezone, user_data (array), type_data

## Authentication
- **Type**: HTTP Basic Authentication
- **Username**: Data Jam Portal email
- **Password**: Data Jam Portal password
- Users can only access projects they're assigned to

## Brand Colors
```css
--dj-black: #0A0C11;
--dj-pink: #E62F6E;
--dj-orange: #E94B52;
--dj-white: #FEFAF9;
--dj-purple: #5E2BFF;
--dj-teal: #15E0BC;
--dj-green: #78C534;
--dj-yellow: #EDBA06;
```

## Typography
- **Font**: Poppins (Google Fonts)
- **Weights**: 300 (light), 500 (medium)

## Key Contacts
- **Dev Team**: devteam@data-jam.com
- **General Support**: team@data-jam.com
- **US (Arran)**: (747) 243 3513
- **UK (Alex)**: +44 7827 813388

## Netlify Account
- **Email**: arran@data-jam.com
- **Team**: arran-vsnsxyy's team

## Related Sites
- `api.data-jam.com` - This API documentation
- `preview.data-jam.com` - Preview/marketing site
- `datajamreports.com` - Main reports portal

## Security Notes
- Proxy function restricted to allowed origins only
- No credentials stored on server
- Request timeout: 30 seconds
- SSL verification disabled for datajamportal.com (cert issue)

## Coming Soon
- **Data Jam PULSE**: Predictive movement analytics engine

## Change Log
- **Dec 9, 2024**: Initial API documentation created and deployed
- **Dec 10, 2024**: Added lat/long documentation, AddData request format
- **Dec 10, 2024**: Added interactive sandbox with serverless proxy
- **Dec 10, 2024**: Added sidebar navigation, search, copy buttons
- **Dec 10, 2024**: Connected to GitHub repo, enabled auto-deploy
- **Dec 10, 2024**: Security audit - removed exposed credentials, secured proxy
