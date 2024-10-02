import {
	SignUpCommand,
	CognitoIdentityProviderClient,
	InitiateAuthCommand,
	RespondToAuthChallengeCommand,
	GlobalSignOutCommand,
	ChallengeName,
} from "@aws-sdk/client-cognito-identity-provider";

import { cognito } from "../globals";

const generate_password = function (length) {
	const lower = "abcdefghijklmnopqrstuvwxyz";
	const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const digits = "0123456789";
	const special = "!@#$%^&*()";
	const charSets = [lower, upper, digits, special];

	const getRandomChar = () => {
		// Select a random character set
		const charSet = charSets[Math.floor(Math.random() * charSets.length)];
		// Generate a random character code from the selected set
		return charSet.charAt(Math.floor(Math.random() * charSet.length));
	};

	const get_password = (length) => {
		let password = "";
		for (let i = 0; i < length; i++) {
			password += getRandomChar();
		}
		return password;
	};

	const passwordPassesTest = (password) => {
		// Make sure password contains at least one character from each set
		const all = (arr, fn = Boolean) => arr.every(fn);
		const any = (arr, fn = Boolean) => arr.some(fn);
		let charSetPresence = [
			any(lower.split("").map((item) => password.includes(item))),
			any(upper.split("").map((item) => password.includes(item))),
			any(digits.split("").map((item) => password.includes(item))),
			any(special.split("").map((item) => password.includes(item))),
		];
		return all(charSetPresence);
	};

	if (length < 4) {
		// It's impossible to generate a passing password so break
		throw new Error("Cannot generate a password with less than 4 characters");
	}

	while (true) {
		let password = get_password(length);
		if (passwordPassesTest(password)) {
			return password;
		}
	}
};

const signUp = ({ phone_number, display_name }) => {
	const client = new CognitoIdentityProviderClient(cognito);

	const command = new SignUpCommand({
		ClientId: cognito.userPoolClientId,
		Username: phone_number,
		Password: generate_password(30),
		UserAttributes: [{ Name: "custom:display_name", Value: display_name }],
	});

	return client.send(command);
};

const initiateAuth = ({ phone_number }) => {
	const client = new CognitoIdentityProviderClient(cognito);
	const input = {
		AuthFlow: "CUSTOM_AUTH",
		ClientId: cognito.userPoolClientId,
		AuthParameters: {
			USERNAME: phone_number,
		},
	};
	const command = new InitiateAuthCommand(input);
	return client.send(command);
};

const initiateAuthRefresh = ({ refreshToken }) => {
	const client = new CognitoIdentityProviderClient(cognito);
	const input = {
		AuthFlow: "REFRESH_TOKEN_AUTH",
		ClientId: cognito.userPoolClientId,
		AuthParameters: {
			REFRESH_TOKEN: refreshToken,
		},
	};
	const command = new InitiateAuthCommand(input);
	return client.send(command);
};

const respondToSMSChallenge = ({ code, sessionToken, phone_number }) => {
	const client = new CognitoIdentityProviderClient(cognito);
	const input = {
		ClientId: cognito.userPoolClientId,
		ChallengeName: "CUSTOM_CHALLENGE",
		Session: sessionToken,
		ChallengeResponses: {
			ANSWER: code,
			USERNAME: phone_number,
		},
	};
	const command = new RespondToAuthChallengeCommand(input);
	return client.send(command);
};

const signOut = ({ access_token }) => {
	const client = new CognitoIdentityProviderClient(cognito);
	const command = new GlobalSignOutCommand({
		AccessToken: access_token,
	});
	return client.send(command);
};

export {
	signUp,
	generate_password,
	initiateAuth,
	initiateAuthRefresh,
	respondToSMSChallenge,
	signOut,
};
