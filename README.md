# Vega Firmware Repository

This repository hosts firmware releases for Dexmate's Vega robots.

## Firmware Hub

Visit our [Firmware Hub](https://dexmate-ai.github.io/vega-firmware/) to browse and download available firmware versions.

## Features

- **Direct GitHub Integration**: All firmware files are hosted as GitHub releases
- **Metadata Support**: Each release includes detailed metadata about components and compatibility
- **Version Management**: Easy browsing of all firmware versions with changelogs
- **Public Access**: No authentication required to download firmware

## Repository Structure

```
vega-firmware/
├── index.html           # Firmware Hub web interface
├── assets/
│   ├── css/
│   │   └── style.css    # Styling for the web interface
│   ├── js/
│   │   └── app.js       # JavaScript functionality
│   └── images/
│       ├── Dexmate_logo_white.png
│       └── Dexmate_logo_black.png
├── README.md           # This file
├── setup.sh            # Repository setup script
└── .github/
    └── workflows/
        └── deploy-pages.yml  # GitHub Pages deployment
```

## Accessing Firmware

### Via Web Interface

1. Visit https://dexmate-ai.github.io/vega-firmware/
2. Browse available firmware versions
3. Click "Download Firmware" for any version

### Via GitHub Releases

1. Go to the [Releases](https://github.com/dexmate-ai/vega-firmware/releases) page
2. Each release contains:
   - `firmware_vX.X.X.dexmate` - The firmware package
   - `metadata_vX.X.X.json` - Package metadata and component information


## Metadata Structure

Each release includes a metadata JSON file with:

```json
{
  "version": "1.0.0",
  "changelog": "Release notes...",
  "upload_time": "2025-01-15T10:00:00Z",
  "filename": "firmware_v1.0.0.dexmate",
  "size": 10485760,
  "package_info": {
    "firmware_version": "1.0.0",
    "package_version": "1.0",
    "created_at": "2025-01-15T09:00:00Z",
    "supported_robots": ["VEGA-1", "VEGA-2"]
  }
}
```

## Contributing

For firmware submissions or issues, please contact: contact@dexmate.ai

## License

Proprietary - Dexmate AI

## Support

For support and questions: please open an issue in this repository