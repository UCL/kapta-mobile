import React from "react";
import { hasCognito } from "./main.js";
import { useUserStore } from "./useUserStore.js";

export default function StatusBar({
	setIsSideMenuVisible,
	setIsDialogVisible,
}) {
	if (!hasCognito()) return null; // don't render anything if we don't have cognito

	const user = useUserStore(); // get user details
	const onLogin = () => {
		setIsDialogVisible(true);
		setIsSideMenuVisible(false);
	};
	const onLogout = () => (user.logged_in = false);
	return (
		<div id="status-bar">
			{user.logged_in ? (
				<div className="logged-in">
					<button onClick={onLogout} className="btn button--logout">
						Logout
					</button>
					<small>
						Logged in as: <span>{user.display_name}</span>
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
