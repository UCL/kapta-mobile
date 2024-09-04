import { /* webpackPrefetch: true */ displayLoginDialog } from "./login.js";
import React from "react";
import Alpine from "alpinejs";

window.displayLoginDialog = displayLoginDialog;

export default function StatusBar({ isVisible }) {
	if (!isVisible) return null;

	const user = Alpine.store("user");
	const onLogin = () => displayLoginDialog();
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
