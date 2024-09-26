const fs = require("fs");
const { secret } = require("@aws-amplify/backend");

async function generateConfig() {
	try {
		// Retrieve secrets from Amplify secrets
		const invokeUrl = secret("api_invoke_url");
		const cognitoPoolId = secret("cognito_userpool_id");
		const cognitoClientId = secret("cognito_userpool_client_id");
		const cognitoRegion = secret("cognito_region");
		const mapboxToken = secret("mapbox_access_token");
		const askTheTeamURL = secret("kapta_ask_the_team_url");

		// Build config object
		const config = {
			cognito: {
				userPoolId: await cognitoPoolId,
				userPoolClientId: await cognitoClientId,
				region: await cognitoRegion,
			},
			api: {
				invokeUrl: await invokeUrl,
			},
			mapbox: {
				accessToken: await mapboxToken,
			},
			kapta: {
				askTheTeamURL: await askTheTeamURL,
			},
		};

		// Write the config.json file to the src directory
		fs.writeFileSync(
			"./src/config.json",
			JSON.stringify(config, null, 2),
			"utf-8"
		);
		console.log("Config file generated successfully");
	} catch (error) {
		console.error("Error generating config file:", error);
	}
}

// Run the function to generate config
generateConfig();
