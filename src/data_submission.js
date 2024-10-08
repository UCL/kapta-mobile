import { INVOKE_URL, CODE_API_URL } from "../globals";

export async function submitData(data, token) {
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

export async function getTaskDetails(code) {
	const url = `${CODE_API_URL}/requests/code/${code}`;
	try {
		const response = await fetch(url, {
			method: "GET",
			mode: "cors",
			headers: {
				"Content-Type": "applications/json",
			},
		});

		const result = await response.json();
		console.info("Data upload success", result);
	} catch (error) {
		console.error("Data upload failed", error);
	}
}
