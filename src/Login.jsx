import { signUp, initiateAuth, respondToSMSChallenge } from "./auth.js";
import KaptaLogo from "./images/icons/kapta-white.png";
import { closeIcon, thumbsUpIcon } from "./icons.js";
import { useUserStore } from "./UserContext.jsx";
import React, { useEffect, useState } from "react";

var phone_number;
var display_name;

function ButtonBox({ setIsDialogVisible }) {
	return (
		<div className="btn-box">
			<button
				className="btn cancel"
				onClick={() => {
					console.log("closing");
					setIsDialogVisible(false);
				}}
			>
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
			initiateAuth(phone_number).then(
				function (response) {
					return getSMSVerificationCode(response.Session, phoneNumber);
				},
				function (error) {
					let message = "Phone number not found. Please sign up.";
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
			signUp( phone_number, display_name )
				.then(function (value) {
					return initiateAuth(phone_number)
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

export function WelcomeBackDialog({ isVisible, setIsVisible }) {
	if (!isVisible) return null;
	const user = useUserStore();
	useEffect(() => {
		let timer = setTimeout(() => {
			try {
				setIsVisible(false);
			} catch (error) {
				console.error("Error hiding the dialog:", error);
			}
		}, 3000);

		// Clean up the timer if the component is unmounted or if `isVisible` changes
		return () => clearTimeout(timer);
	}, [isVisible, setIsVisible]);
	return (
		<dialog id="welcome-back">
			<div>
				<h3>Welcome back, {user.displayName} </h3>
			</div>
		</dialog>
	);
}

export function LoginDialog({ isVisible, setIsVisible, setIsWelcomeVisible }) {
	const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);
	const [isSignupFormVisible, setIsSignupFormVisible] = useState(false);
	const [isSmsInputVisible, setIsSmsInputVisible] = useState(false);
	const [sessionToken, setSessionToken] = useState(null);
	const [message, setMessage] = useState("Sign up to Kapta");
	const [phoneNumber, setPhoneNumber] = useState(null);

	if (!isVisible) return null;

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
					setIsDialogVisible={setIsVisible}
					sessionToken={sessionToken}
					phoneNumber={phoneNumber}
					setIsWelcomeVisible={setIsWelcomeVisible}
				/>
			)}
			<ButtonBox setIsDialogVisible={setIsVisible} />
		</dialog>
	);
}

function SmsInput({
	setIsDialogVisible,
	sessionToken,
	phoneNumber,
	setIsWelcomeVisible,
}) {
	const user = useUserStore();
	const handleSubmit = (e) => {
		e.preventDefault();
		var formData = new FormData(e.target);
		const code = formData.get("code");
		const data = {
			code: code,
			sessionToken: sessionToken,
			phoneNumber: phoneNumber,
		};
		return respondToSMSChallenge(data)
			.then((response) => {
				let authResult = response.AuthenticationResult;
				let userDetails = {
					accessToken: authResult.AccessToken,
					idToken: authResult.IdToken,
					refreshToken: authResult.RefreshToken,
				};
				user.setUserDetails(userDetails);
				setIsDialogVisible(false);
				setIsWelcomeVisible(true);
			})
			.catch((error) =>
				displayConsoleError("Error responding to SMS challenge", error)
			);
	};
	return (
		<form onSubmit={handleSubmit} id="dialog-form">
			<label>Please enter your SMS verification code.</label>
			<br></br>
			<input type="text" name="code" className="sms"></input>
		</form>
	);
}
