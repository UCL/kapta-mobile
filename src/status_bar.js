import { /* webpackPrefetch: true */ displayLoginDialog } from "./login.js";
import Alpine from "alpinejs";

window.displayLoginDialog = displayLoginDialog;

export const displayStatusBar = () => {
	const parent = document.querySelector("#main");
	if (Alpine.store("appData")) {
		if (Alpine.store("appData").hasCognito) {
			const statusBar = document.createElement("div");
			statusBar.id = "status-bar";
			statusBar.insertAdjacentHTML(
				"afterbegin",
				`
            <div x-show="$store.user.logged_in" class="logged-in">
                <button @click="$store.user.logout()" class="btn button--logout">Logout</button> 
				<small>Logged in as: <span x-show="$store.user.logged_in" x-text="$store.user.display_name"></span></small>
            </div>
            <div x-show="!$store.user.logged_in">
                <button @click="displayLoginDialog()" class="btn button--login">Login</button>
            </div>
        `
			);
			parent.prepend(statusBar);
		}
	}
};
