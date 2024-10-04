import { signUp, initiateAuth, respondToSMSChallenge } from "./auth.js";
import KaptaLogo from "./images/icons/kapta-white.png";
import { closeIcon, thumbsUpIcon } from "./icons.js";
import { useUserStore } from "./useUserStore.js";
import React, { useState } from "react";

var loginDialog;
var phone_number;
var display_name;

function createButtonBox() {
	// var cancelBtn = document.createElement("button");
	// cancelBtn.classList.add("cancel", "btn");
	// cancelBtn.innerHTML = closeIcon;
	// var cancelBtnIcon = cancelBtn.querySelector("svg");
	// cancelBtnIcon.alt = "Cancel";
	// cancelBtnIcon.classList.add("btn-icon");
	// var submitBtn = document.createElement("button");
	// submitBtn.classList.add("btn", "confirm");
	// submitBtn.innerHTML = thumbsUpIcon;
	// var submitBtnIcon = submitBtn.querySelector("svg");
	// submitBtnIcon.alt = "Submit";
	// submitBtnIcon.classList.add("btn-icon");
	// var buttonContainer = document.createElement("div");
	// buttonContainer.appendChild(cancelBtn);
	// buttonContainer.appendChild(submitBtn);
	// buttonContainer.classList.add("btn-box");
	// return buttonContainer;
}
function ButtonBox({ setIsDialogVisible }) {
	return (
		<div className="btn-box">
			<button className="btn cancel" onClick={() => setIsDialogVisible(false)}>
				{closeIcon}
			</button>
			<button className="btn confirm" form="dialog-form">
				{thumbsUpIcon}
			</button>
		</div>
	);
}

function displayConsoleError(message, error) {
	return console.error(message, error);
}

function LoginForm({
	phoneNumber,
	setPhoneNumber,
	showSignupForm,
	getSMSVerificationCode,
}) {
	const handleInputChange = (e) => {
		setPhoneNumber(e.target.value);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		var formData = new FormData(e.target);
		phone_number = formData.get("phone-number");
		phoneNumber === phone_number &&
			initiateAuth({ phone_number }).then(
				function (response) {
					return getSMSVerificationCode(response.Session, phoneNumber);
				},
				function (error) {
					let message = "Phone number not found. Please sign up.";
					console.log("ERROR", phone_number, message);
					showSignupForm(phone_number, message);
					displayConsoleError(message, error);
				}
			);
	};
	return (
		<form onSubmit={handleSubmit} className="login-form" id="dialog-form">
			<input
				name="phone-number"
				type="tel"
				placeholder="📞 + Phone Number"
				onChange={handleInputChange}
			></input>
		</form>
	);
}

function SignUpForm({
	phoneNumber,
	setPhoneNumber,
	message,
	getSMSVerificationCode,
}) {
	const handleSubmit = (e) => {
		e.preventDefault();
		var formData = new FormData(e.target);
		display_name = formData.get("display-name");
		phone_number = formData.get("phone-number");
		phoneNumber === phone_number &&
			signUp({ phone_number, display_name })
				.then(function (value) {
					return initiateAuth({ phone_number })
						.then(function (response) {
							return getSMSVerificationCode(response.Session, phone_number);
						})
						.catch((error) =>
							displayConsoleError("Error in initiating auth", error)
						);
				})
				.catch((error) => displayConsoleError("Error in sign up", error));
	};
	const handlePhoneNumberChange = (e) => {
		setPhoneNumber(e.target.value);
	};
	return (
		<form className="signup-form" id="dialog-form" onSubmit={handleSubmit}>
			<p>{message}</p>
			<input name="display-name" type="text" placeholder="👤 Name"></input>
			<input
				name="phone-number"
				type="tel"
				placeholder="📞 + Phone Number"
				value={phoneNumber}
				onChange={handlePhoneNumberChange}
			></input>
		</form>
	);
}

export function LoginDialog({ isDialogVisible, setIsDialogVisible }) {
	if (!isDialogVisible) return null;
	const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);
	const [isSignupFormVisible, setIsSignupFormVisible] = useState(false);
	const [isSmsInputVisible, setIsSmsInputVisible] = useState(false);
	const [sessionToken, setSessionToken] = useState(null);
	const [message, setMessage] = useState("Sign up to Kapta");
	const [phoneNumber, setPhoneNumber] = useState(null);

	const showSignupForm = (phone_number = null, message = null) => {
		setIsLoginFormVisible(false);
		setIsSignupFormVisible(true);
		setMessage(message);
		setPhoneNumber(phone_number);
	};

	const getSMSVerificationCode = (sessionToken, phoneNumber) => {
		setIsLoginFormVisible(false);
		setIsSignupFormVisible(false);
		setIsSmsInputVisible(true);
		setSessionToken(sessionToken);
		setPhoneNumber(phoneNumber);
		console.log("getting sms verification code", sessionToken, phoneNumber);
	};

	return (
		<dialog id="login-dialog">
			<h3>Log in to Kapta</h3>
			<img
				className="logo"
				src={KaptaLogo}
				alt="Kapta Logo: a red square with a white pin in a message bubble"
			></img>
			{isLoginFormVisible && (
				<LoginForm
					phoneNumber={phoneNumber}
					setPhoneNumber={setPhoneNumber}
					showSignupForm={showSignupForm}
					getSMSVerificationCode={getSMSVerificationCode}
				/>
			)}
			{isSignupFormVisible && (
				<SignUpForm
					phoneNumber={phoneNumber}
					setPhoneNumber={setPhoneNumber}
					message={message}
					getSMSVerificationCode={getSMSVerificationCode}
				/>
			)}
			{isSmsInputVisible && (
				<SmsInput
					setIsDialogVisible={setIsDialogVisible}
					sessionToken={sessionToken}
					phoneNumber={phoneNumber}
				/>
			)}
			<ButtonBox setIsDialogVisible={setIsDialogVisible} />
		</dialog>
	);
}

function SmsInput({ setIsDialogVisible, sessionToken, phoneNumber }) {
	const user = useUserStore();
	console.log("smsinput", phoneNumber);
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(e);
		const data = {
			code: code,
			sessionToken: sessionToken,
			phoneNumber: phoneNumber,
		};
		return respondToSMSChallenge(data)
			.then(function (response) {
				console.log("response is", response);
				let authResult = response.AuthenticationResult;
				user.accessToken = authResult.AccessToken;
				user.idToken = authResult.IdToken;
				user.refreshToken = authResult.RefreshToken;
				setIsDialogVisible(false);
			})
			.catch((error) =>
				displayConsoleError("Error responding to SMS challenge", error)
			);
	};
	return (
		<form onSubmit={handleSubmit}>
			<label>Please enter your SMS verification code.</label>
			<br></br>
			<input type="text" name="input" className="sms"></input>
		</form>
	);
}
