const config = require("./config.json");
const invokeURL = config.api.invokeUrl;

async function submitData(data, token) {
	try {
		const response = await fetch(invokeURL, {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "applications/json",
				Authorization: token,
			},
			body: JSON.stringify(data),
		});

		const result = await response.json();
		console.info("Data upload success", result);
	} catch (error) {
		console.error("Data upload failed", error);
	}
}

export { submitData };
