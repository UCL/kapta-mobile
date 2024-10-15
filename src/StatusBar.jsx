import React from "react";
import { hasCognito } from "../globals.js";
import { useUserStore } from "./UserContext.js";

export default function StatusBar({
	setIsSideMenuVisible,
	setIsDialogVisible,
	setIsWelcomeVisible,
}) {
	if (!hasCognito) return null; // don't render anything if we don't have cognito
	const user = useUserStore();
	const onLogin = () => {
		// check if user details are already in localStorage
		const hasDetails = user.checkForDetails();

		if (!hasDetails) {
			setIsDialogVisible(true);
		} else {
			setIsWelcomeVisible(true);
		} // show welcome back
		setIsSideMenuVisible(false);
	};
	const onLogout = () => (user.logout(), setIsSideMenuVisible(false));
	return (
		<div id="status-bar">
			{user.loggedIn ? (
				<div className="logged-in">
					<button onClick={onLogout} className="btn button--logout">
						Logout
					</button>
					<small>
						Logged in as: <span>{user.displayName}</span>
					</small>
				</div>
			) : (
				<div>
					<button onClick={onLogin} className="btn button--login">
						Login
					</button>
				</div>
			)}
		</div>
	);
}
