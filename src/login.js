import Alpine from "alpinejs";
import {
	signUp,
	initiateAuth,
	respondToSMSChallenge,
	signOut,
} from "./auth.js";
import KaptaLogo from "./images/icons/kapta-white.png";
import { closeIcon, thumbsUpIcon } from "./icons.js";

var loginDialog;
var phone_number;
var display_name;

function createButtonBox() {
	var cancelBtn = document.createElement("button");
	cancelBtn.classList.add("cancel", "btn");
	cancelBtn.innerHTML = closeIcon;
	var cancelBtnIcon = cancelBtn.querySelector("svg");
	cancelBtnIcon.alt = "Cancel";
	cancelBtnIcon.classList.add("btn-icon");

	var submitBtn = document.createElement("button");
	submitBtn.classList.add("btn", "confirm");
	submitBtn.innerHTML = thumbsUpIcon;
	var submitBtnIcon = submitBtn.querySelector("svg");
	submitBtnIcon.alt = "Submit";
	submitBtnIcon.classList.add("btn-icon");

	var buttonContainer = document.createElement("div");
	buttonContainer.appendChild(cancelBtn);
	buttonContainer.appendChild(submitBtn);

	buttonContainer.classList.add("btn-box");

	return buttonContainer;
}

function createPhoneInput() {
	const phoneInput = document.createElement("input");
	phoneInput.name = "phone-number";
	phoneInput.type = "tel";
	phoneInput.placeholder = "📞 + Phone Number";
	return phoneInput;
}

function buildLoginDialog() {
	const dialog = document.createElement("dialog");
	dialog.id = "login-dialog";
	var title = document.createElement("h3");
	title.textContent = "Log in to Kapta";
	dialog.appendChild(title);

	const loginForm = document.createElement("form");

	const logo = document.createElement("img");
	logo.src = KaptaLogo;
	logo.alt = "Kapta Logo";
	logo.classList.add("logo");

	var phoneInput = createPhoneInput();

	var buttonContainer = createButtonBox();
	loginForm.appendChild(phoneInput);
	loginForm.appendChild(buttonContainer);

	addLoginFormListeners(loginForm);

	dialog.appendChild(logo);
	dialog.appendChild(loginForm);

	return dialog;
}

function displayConsoleError(message, error) {
	return console.error(message, error);
}

function addLoginFormListeners(loginForm) {
	loginForm.addEventListener("submit", function (e) {
		e.preventDefault();
		var formData = new FormData(loginForm);
		phone_number = formData.get("phone-number");
		initiateAuth({ phone_number }).then(
			function (response) {
				return getSMSVerificationCode(response.Session)
					.then(function (data) {
						console.info("Confirming SMS code with", data);
						let code = data.code;
						let sessionToken = data.sessionToken;
						return respondToSMSChallenge({
							code,
							sessionToken,
							phone_number,
						})
							.then(function (response) {
								let authResult = response.AuthenticationResult;
								Alpine.store("user").accessToken = authResult.AccessToken;
								Alpine.store("user").idToken = authResult.IdToken;
								Alpine.store("user").refreshToken = authResult.RefreshToken;
							})
							.catch((error) =>
								displayConsoleError("Error responding to SMS challenge", error)
							);
					})
					.catch((error) =>
						displayConsoleError("Error getting SMS code from user.", error)
					);
			},
			function (error) {
				let message = "Phone number not found. Please sign up.";
				displaySignUpForm(phone_number, message);
				displayConsoleError(message, error);
			}
		);
	});
	const cancelBtn = loginForm.querySelector(".cancel");
	cancelBtn.addEventListener(
		"click",
		function () {
			destroyDialog(document.getElementById("login-dialog"));
		},
		{ once: true }
	);
}

function displaySignUpForm(phone_number, message) {
	const dialog = document.getElementById("login-dialog");

	const signUpForm = document.createElement("form");
	signUpForm.classList.add("signup-form");

	const messageElement = document.createElement("p");
	messageElement.textContent = message;

	var nameInput = document.createElement("input");
	nameInput.name = "display-name";
	nameInput.type = "text";
	nameInput.placeholder = "👤 Name";

	var phoneInput = createPhoneInput();

	var buttonContainer = createButtonBox();

	signUpForm.appendChild(messageElement);
	signUpForm.appendChild(nameInput);
	signUpForm.appendChild(phoneInput);
	signUpForm.appendChild(buttonContainer);

	addSignUpFormListeners(signUpForm);

	// Remove current form and replace with new one
	let initialForm = dialog.querySelector("form");
	initialForm.remove();
	dialog.appendChild(signUpForm);
}

function addSignUpFormListeners(signUpForm) {
	signUpForm.addEventListener("submit", function (e) {
		e.preventDefault();
		var formData = new FormData(signUpForm);
		display_name = formData.get("display-name");
		phone_number = formData.get("phone-number");
		signUp({ phone_number, display_name })
			.then(function (value) {
				return initiateAuth({ phone_number })
					.then(function (response) {
						return getSMSVerificationCode(response.Session)
							.then(function (data) {
								if (!data) {
									return;
								}
								let code = data.code;
								let sessionToken = data.sessionToken;
								return respondToSMSChallenge({
									code,
									sessionToken,
									phone_number,
								})
									.then(function (response) {
										let authResult = response.AuthenticationResult;
										Alpine.store("user").accessToken = authResult.AccessToken;
										Alpine.store("user").idToken = authResult.IdToken;
										Alpine.store("user").refreshToken = authResult.RefreshToken;
									})
									.catch((error) =>
										displayConsoleError(
											"Error responding to SMS challenge",
											error
										)
									);
							})
							.catch((error) =>
								displayConsoleError("Error getting SMS code from user.", error)
							);
					})
					.catch((error) =>
						displayConsoleError("Error in initiating auth", error)
					);
			})
			.catch((error) => displayConsoleError("Error in sign up", error));
	});
	const cancelBtn = signUpForm.getElementsByClassName("cancel")[0];
	cancelBtn.addEventListener(
		"click",
		function () {
			destroyDialog(document.getElementById("login-dialog"));
		},
		{ once: true }
	);
}

async function destroyDialog(dialog) {
	return dialog.remove();
}

function getSMSVerificationCode(sessionToken) {
	return new Promise(async function (resolve) {
		var dialog = document.getElementById("login-dialog");
		// Create new form to capture SMS code
		var form = document.createElement("form");
		var smsInput = `                <label>Please enter your SMS verification code.</label><input type="text" name="input" class="sms" />`;
		form.innerHTML = smsInput;
		form.appendChild(createButtonBox());
		form.addEventListener(
			"submit",
			function (e) {
				e.preventDefault();
				resolve({
					code: e.target.input.value,
					sessionToken: sessionToken,
				});
				destroyDialog(dialog);
			},
			{ once: true }
		);
		var cancelBtn = form.querySelector(".cancel");
		cancelBtn.addEventListener(
			"click",
			function () {
				resolve(null);
				destroyDialog(dialog);
			},
			{ once: true }
		);

		// Remove current form and replace with new one
		let initialForm = dialog.querySelector("form");

		initialForm.remove();
		dialog.appendChild(form);
	});
}

function displayLoginDialog() {
	loginDialog = buildLoginDialog();
	document.body.appendChild(loginDialog);
	loginDialog.showModal();
}

export { displayLoginDialog, getSMSVerificationCode };
