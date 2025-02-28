# Kapta Mobile

Kapta Mobile is a Progressive Web App to convert WhatsApp chats into WhatsApp Maps

👉 📱 https://mobile.kapta.earth

Visit Kapta Web
👉 https://kapta.earth

# Guidance for Developers

- [Kapta Web repository](https://github.com/UCL/kapta-web)
- [Kapta Infrastructure repository](https://github.com/UCL/kapta-infrastructure)
  
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

<!-- need to update to make relevant to env vars -->
<!-- something like Kapta requires certain environment variables to work, look in globals.js to see what they're called -->

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
		"askTheTeamURL": "" // URL for user support e.g. WhatsApp business chat URL (optional)
	}
}
```

# Legal disclaimer

Copyright 2024 University College London (UCL)

Licensed under the **Apache License, Version 2.0** (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
