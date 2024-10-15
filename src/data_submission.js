import { INVOKE_URL, CODE_API_URL } from "../globals";

// function to submit data that ends up in s3
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

// function to get task details from task dynamodb
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

		const info = JSON.parse(result); // it's returning the whole thing as a single object
		return info;
	} catch (error) {
		console.error("Data retrieval failed", error);
	}
}

// function to create task in task dynamodb, mainly done for opendata
export async function createTask(values) {
	const url = `${CODE_API_URL}/requests`;
	try {
		const response = await fetch(url, {
			method: "PUT",
			mode: "cors",
			headers: {
				"Content-Type": "applications/json",
			},
			body: JSON.stringify(values),
		});

		const result = await response.json();

		const info = JSON.parse(result); // it's returning the whole thing as a single object
		return info;
	} catch (error) {
		console.error("Data retrieval failed", error);
	}
}
