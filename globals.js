// central place to define the variables we'll be pulling from the env
export const ASK_URL = process.env.ASK_URL;
export const POOL_ID = process.env.POOL_ID;
export const CLIENT_ID = process.env.CLIENT_ID;
export const REGION = process.env.REGION;
export const UPLOAD_URL = process.env.UPLOAD_URL;
export const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
export const CODE_API_URL = process.env.CODE_API_URL;

export let cognito = null;
export let hasCognito = false;
// only set hasCognito to true if both id and client are available
if (POOL_ID !== "null" && CLIENT_ID !== "null") {
	// checking for null string due to amplify store
	hasCognito = true;
	cognito = {
		userPoolId: POOL_ID,
		userPoolClientId: CLIENT_ID,
		region: REGION,
	};
}
