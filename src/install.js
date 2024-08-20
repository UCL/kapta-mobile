import i18next from "i18next";

let installPrompt = null;
let dismissed = false;

function promptToInstall() {
	return new Promise(async function (resolve) {
		const installDialog = document.createElement("dialog");
		installDialog.id = "install-dialog";
		const installReason = document.createElement("div");
		installReason.innerText = i18next.t("installPrompt");
		installDialog.appendChild(installReason);
		const installBtn = document.createElement("button");
		installBtn.innerText = i18next.t("install");
		installBtn.addEventListener("click", async () => {
			if (!installPrompt) {
				resolve(false);
			}
			const result = await installPrompt.prompt();
			if (result.outcome === "dismissed") {
				dismissed = true;
			}
			installPrompt = null;
			installDialog.close();
			installDialog.remove();
			resolve(result.outcome);
		});
		installDialog.appendChild(installBtn);
		const closeBtn = document.createElement("button");
		closeBtn.innerText = i18next.t("dismiss");
		closeBtn.addEventListener("click", () => {
			dismissed = true;
			resolve(false);
			installPrompt = null;
			installDialog.close();
			installDialog.remove();
		});
		installDialog.appendChild(closeBtn);
		const container = document.querySelector("#main");
		container.appendChild(installDialog);
	});
}

async function handleInstallPrompt() {
	let install = await promptToInstall();
	console.info("Install prompt outcome", install);
}

function initialiseInstallPrompt() {
	window.addEventListener("beforeinstallprompt", (event) => {
		event.preventDefault;
		if (!dismissed) {
			installPrompt = event;
			handleInstallPrompt();
		}
	});
}

export { initialiseInstallPrompt };
