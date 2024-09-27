// central place to define the variables we'll be pulling from the env
export const ASK_URL = process.env.ASK_URL;
export const POOL_ID = process.env.POOL_ID;
export const CLIENT_ID = process.env.CLIENT_ID;
export const REGION = process.env.REGION;
export const INVOKE_URL = process.env.INVOKE_URL;
export const MAPBOX_TOKEN = process.token.MAPBOX_TOKEN;

// for hasCognito, we should check if we have a pool id and client id and return true if yes
// and then we can do the following

export const cognito = {
	userPoolId: POOL_ID,
	userPoolClientId: CLIENT_ID,
	region: REGION,
};
