# Data Jam API Documentation Project

## Overview
This project contains the API documentation for Data Jam's Customer API, deployed to **api.data-jam.com**.

## What is Data Jam?
Data Jam is an OOH (Out-of-Home) advertising analytics platform that uses JamBox sensors to capture real-time footfall, impressions, dwell time, and visitor data for advertising locations.

## Live Site
- **URL**: https://api.data-jam.com
- **Hosting**: Netlify (manual deploy)
- **Netlify Site ID**: `52e18928-8eca-4cc7-9847-b4e20d321858`
- **Netlify Site Name**: `jocular-tulumba-3592b1`

## Deployment
The folder is linked to Netlify. To deploy updates:
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
├── index.html              # Main API documentation page (edit this)
├── datajam_logo.png        # Data Jam logo
├── icons/                  # Section icons (SVG)
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
├── docs/                   # Postman collection files (reference)
│   ├── Device_info_get.json
│   ├── DwellTime_All.json
│   ├── DwellTime_Default.json
│   ├── Impression_All.json
│   ├── Impression_Default.json
│   ├── UserData_get.json
│   ├── Visitors_All.json
│   └── Visitors_Default.json
├── assets/                 # Additional assets (empty)
└── CONTEXT.md              # This file
```

## API Base URL
```
https://datajamportal.com/CustomerAPI/
```

## API Endpoints

### 1. GetData (GET)
Retrieves footfall, impressions, dwell time, or visitor data.
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
- **Returns**:
  - `device_number` - JamBox ID
  - `device_status` - Enabled/Disabled
  - `latitude` / `longitude` - GPS coordinates
  - `timezone` - IANA timezone
  - `dev_location_ref` - Location reference name
  - `dev_frameid` - Frame ID
  - `mac_address` - Device MAC
  - `min_rssi` - Signal threshold

### 3. AddData (POST)
Submit custom user data for external data integration.
- **URL**: `/CustomerAPI/AddData/`
- **Use case**: Integrate sales, weather, event, or other external data
- **Required fields**: project_name, device_number, timezone, user_data (array), type_data
- **Format**: Array of timestamp/value pairs with timezone

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

## Related Netlify Sites
- `api.data-jam.com` - This API documentation (manual deploy)
- `preview.data-jam.com` - Preview site
- `datajamreports.com` - Main reports portal

## Coming Soon
- **Data Jam PULSE**: Predictive movement analytics engine

## Change Log
- **Dec 9, 2024**: Initial API documentation created and deployed
- **Dec 10, 2024**: Added lat/long documentation, AddData request format, organized project structure, linked to Netlify CLI
