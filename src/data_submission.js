import { UPLOAD_URL, CODE_API_URL } from "../globals";

// function to submit data that ends up in s3
export async function submitData(dataset, id, token) {
	const data = {
		taskId: id,
		dataset: dataset,
	};
	try {
		const response = await fetch(UPLOAD_URL, {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
			body: JSON.stringify(data),
		});

		const result = await response;
		return result;
	} catch (error) {
		console.error("Data upload failed", error);
	}
}

// function to get task details from task dynamodb
export async function getTaskDetails(code, token) {
	const url = `${CODE_API_URL}/requests/code/${code}`;
	try {
		const response = await fetch(url, {
			method: "GET",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
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
export async function createTask(values, token) {
	const url = `${CODE_API_URL}/requests/new-opendata`;
	try {
		const response = await fetch(url, {
			method: "PUT",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
			body: JSON.stringify(values),
		});

		const result = await response.json();
		return result;
	} catch (error) {
		console.error("Data retrieval failed", error);
	}
}
