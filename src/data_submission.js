import { INVOKE_URL } from "../globals";

async function submitData(data, token) {
	try {
		const response = await fetch(INVOKE_URL, {
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
