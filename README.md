# kapta-mobile
Progressive Web App enabling users to generate maps from WhatsApp chats

## Requirements
- Node.js v20.0.0 or later
- npm v10.0.0 or later
- mapbox API key (create an account at https://www.mapbox.com/)

## Installation
1. Clone the repository: `git clone https://github.com/UCL/kapta-mobile.git && cd kapta-mobile`
2. Run `npm install` in the root directory
3. Create config file (see below)
4. Run `npm run build` to build the project
5. Run `npm start` to start the development server
6. Open `http://localhost:8080` in your browser

## Configuration
Kapta requires a configuration file to be created in the src directory. The file should be named `config.json` and should contain the following fields:
```json
{
  "mapbox": {
    "accessToken": "YOUR_MAPBOX_ACCESS_TOKEN"
  },
  "api": {
    "invokeUrl": "" // API URL (optional)
  },
  "kapta": {
    "askTheTeamURL": ""  // URL for user support e.g. WhatsApp business chat URL (optional)
  }
}
```

## Usage
Visiting the website with a compatible mobile device and browser will prompt you to add the app to your home screen. Once added, you can open the app from your home screen and generate maps from WhatsApp chats.

1. Open WhatsApp and navigate to the chat you want to generate a map from
2. Tap the three dots in the top right corner and select 'Export chat'
3. Select Kapta from the list of apps
4. The app will process the chat and display a map of the locations mentioned in the chat
