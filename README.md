# Kapta

## What? ###

Kapta Mobile is a Progressive Web App enabling users to generate maps from WhatsApp chats.

👉 📱 http://kapta.earth

Create WhatsApp Maps with Kapta:
  * Share locations in a WhatsApp group
  * Export chat to Kapta
  * Share your WhatsApp Map

## Why? ###
To connect users and producers of ground information. See our latest blog and where this started in 2010:
  * [WhatsApp Maps? Connecting users and producers of ground information](https://uclexcites.blog/2024/06/26/whatsapp-maps-connecting-users-and-producers-of-ground-information/)
  * [Extreme Citizen Science in the Congo rainforest](https://www.youtube.com/watch?v=IgQc7GQ1m_Y)

## What's next? ###
Kapta: A (de)centralised crowdsourcing system to connect users and producers of ground information.

## Who? ###
Kapta is being developed by the [University College London (UCL)](http://ucl.ac.uk) [Extreme Citizen Science (ExCiteS) research group](http://ucl.ac.uk/excites) and the [Advanced Research Computing Centre (UCL ARC)](https://www.ucl.ac.uk/advanced-research-computing), with help from outside partners & contributors.

Currently the core Kapta team consists of:
  * [Marcos Moreu](https://www.ucl.ac.uk/geography/marcos-moreu), UCL Geography
  * [Fabien Moustard](https://www.ucl.ac.uk/geography/fabien-moustard), UCL Geography
  * [Tom Couch](https://www.ucl.ac.uk/advanced-research-computing/people/tom-couch), UCL ARC
  * [Muki Haklay](http://www.ucl.ac.uk/excites/people/academic-staff/muki-haklay), UCL Geography
  * [Jonathan Cooper](https://www.ucl.ac.uk/advanced-research-computing/people/jonathan-cooper), UCL ARC
  * [Claire Ellul](https://www.ucl.ac.uk/civil-environmental-geomatic-engineering/people/dr-claire-ellul), UCL CEGE
  * [Amanda Ho-Lyn](https://www.ucl.ac.uk/advanced-research-computing/research-software-engineers-0), UCL ARC
  * [Jed Stevenson](https://www.durham.ac.uk/staff/jed-stevenson/), Durham University
  * [Dessalegn Teckle](https://et.linkedin.com/in/dessalegn-tekle-02b848ba), Addis Ababa University, NGO IPC

# Guidance for Developers

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

# Legal disclaimer
Copyright © 2024 [University College London](http://ucl.ac.uk)

Licensed under the **Apache License, Version 2.0** (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
