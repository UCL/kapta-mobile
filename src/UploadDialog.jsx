import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createTask, getTaskDetails, submitData } from "./data_submission.js";
import "./styles/main.css";
import { addMetaIcn, nextIcn } from "./icons";
import { useUserStore } from "./UserContext.jsx";
import { LoginDialog, WelcomeBackDialog } from "./Login.jsx";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const opendataCode = "OPENDATA";
const opendataId = opendataCode.toLowerCase();
export function UploadDialog({
	isOpen,
	setIsOpen,
	currentDataset,
	setSuccessModalVisible,
}) {
	if (!isOpen) return null;

	const { t } = useTranslation();
	const [isChecked, setIsChecked] = useState(false);
	const [isLoginVisible, setIsLoginVisible] = useState(false);
	const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);
	const [task, setTask] = useState(null);
	const [showOpenDataForm, setShowOpenDataForm] = useState(false);
	const [hasCodeError, setHasCodeError] = useState(false);

	const user = useUserStore();
	var hasDetails;
	const checkDetails = async () => {
		hasDetails = await user.checkForDetails();
		return hasDetails;
	};
	checkDetails();

	const checkCode = async (e) => {
		e.preventDefault();
		var formData = new FormData(e.target);
		const code = formData.get("c-code");
		if (code === opendataCode) {
			// handle opendata request
			return setShowOpenDataForm(true);
		} else {
			// normal campaign code
			const response = await getTaskDetails(code);
			if (!response) {
				console.error("Error: no response received");
				return setHasCodeError(true);
			} else {
				const task = {
					id: response.task_id?.S,
					description: response.task_description?.S,
					title: response.task_title?.S,
				};
				return setTask(task);
			}
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!isChecked) {
			// this shouldn't trigger because the button is disabled when not checked
			console.error("Permission not given");
			return;
		} else {
			const response = await submitData(currentDataset, task.id, user.idToken);
			if (response.status === 200) {
				setIsOpen(false);
				setSuccessModalVisible(true);
			}
		}
	};
	const handleODSubmit = async (e) => {
		e.preventDefault();
		if (!isChecked) {
			// this shouldn't trigger because the button is disabled when not checked
			console.error("Permission not given");
			return;
		} else {
			// create a new task and then submit the data
			var formData = new FormData(e.target);
			const taskId = `${opendataId}-${user.userId}`;
			const data = {
				campaignCode: opendataCode,
				title: formData.get("task-title"),
				description: formData.get("task-description"),
				createdBy: user.userId,
				organisation: "opendata",
				private: false,
				visible: true,
				taskID: taskId,
			};
			const response = await createTask(data);
			if (response.includes(taskId)) {
				const response = await submitData(
					currentDataset,
					task.id,
					user.idToken
				);
				if (response.status === 200) {
					setIsOpen(false);
					setSuccessModalVisible(true);
				}
			}
		}
	};

	const handleInfoClick = (e) => {
		const abbrElem = e.target.closest("abbr");
		return alert(abbrElem.title);
	};

	useEffect(() => {
		if (isOpen && hasDetails && !user.loggedIn) {
			setIsWelcomeVisible(true);
			//TODO: set user as logged or is this is handled in checkdetails
		}
	}, [isOpen, user.loggedIn, hasDetails]);

	// trying to get login dialog to show even after it's dismissed
	// useEffect(() => {
	// 	if (!user.loggedIn && !hasDetails) {
	// 		console.log("not logged in and no details");
	// 		setIsLoginVisible(true);
	// 	}
	// }, [isOpen, user.loggedIn, hasDetails, isLoginVisible]);

	return (
		<>
			{!user.loggedIn && !hasDetails && (
				<LoginDialog
					visible={true}
					isDialogVisible={isLoginVisible}
					setIsDialogVisible={setIsLoginVisible}
					setIsWelcomeVisible={setIsWelcomeVisible}
				/>
			)}
			<WelcomeBackDialog
				isVisible={isWelcomeVisible}
				setIsVisible={setIsWelcomeVisible}
				version="r"
			/>
			{user.loggedIn && (
				<>
					<dialog id="upload-dialog" open>
						{!task && !showOpenDataForm && (
							<>
								{/* check the code or choose open data */}
								<form onSubmit={checkCode} className="code-form">
									<label>
										If you have a <strong>campaign code</strong>, enter it
										below.<br></br>
										<input
											placeholder="Campaign code"
											type="text"
											name="c-code"
											className="code-input"
										></input>
									</label>
									<button type="submit" className="btn check-code">
										{nextIcn}
									</button>
									{hasCodeError && (
										<small className="code-error">
											Code not valid, check code and try again
										</small>
									)}
								</form>
								<hr></hr>

								{/* opendata button */}
								<form onSubmit={checkCode} className="code-form">
									<p>
										If you want to upload your data as{" "}
										<strong>open data</strong>, click the button below.{" "}
										<abbr
											onClick={handleInfoClick}
											className="opendata-info"
											title="Open Data"
										>
											{" "}
											<FontAwesomeIcon icon={faInfoCircle} />
										</abbr>
									</p>

									<input
										hidden
										type="text"
										name="c-code"
										defaultValue={opendataCode}
									></input>
									<button type="submit" className="btn opendata">
										Share for public use
									</button>
								</form>
							</>
						)}
						{/* opendata request - will also create a new task */}
						{!task && showOpenDataForm && (
							<form className="upload-form" onSubmit={handleODSubmit}>
								<h3>Upload data to Kapta</h3>
								<small>
									{t("addMetadataTitle")} {addMetaIcn}
								</small>

								<label htmlFor="task-title">{t("inputtopiclabel")}</label>
								<textarea name="task-title" id="task-title"></textarea>

								<label htmlFor="task-description">{t("inputgoallabel")}</label>
								<textarea
									name="task-description"
									id="task-description"
								></textarea>
								<label htmlFor="data-sov">{t("datasovmessage")}</label>
								<label htmlFor="data-sov" className="toggle">
									<input
										type="checkbox"
										id="data-sov"
										name="data-sov"
										className="toggle-input"
										checked={isChecked}
										onChange={(e) => setIsChecked(e.target.checked)}
									/>
									<span
										className="toggle-label"
										data-on={t("yes")}
										data-off={t("no")}
									></span>
								</label>
								<div className="btn-area">
									<button
										className="cancel btn"
										onClick={() => setIsOpen(false)}
									>
										{t("cancel")}
									</button>
									<button
										type="submit"
										className="confirm btn"
										disabled={!isChecked}
									>
										{t("confirm")}
									</button>
								</div>
							</form>
						)}
						{/* if they have a campaign code */}
						{task && !showOpenDataForm && (
							<form className="upload-form" onSubmit={handleSubmit}>
								<h4 className="grey">Upload data to Kapta</h4>
								<h2>Task Details</h2>
								<h3 name="task-title" id="task-title">
									<small>Title:</small> {task.title}
								</h3>

								<p name="task-description" id="task-description">
									<span>Description: </span>
									{task.description}
								</p>

								<label htmlFor="data-sov">{t("datasovmessage")}</label>
								<label htmlFor="data-sov" className="toggle">
									<input
										type="checkbox"
										id="data-sov"
										name="data-sov"
										className="toggle-input"
										checked={isChecked}
										onChange={(e) => setIsChecked(e.target.checked)}
									/>
									<span
										className="toggle-label"
										data-on={t("yes")}
										data-off={t("no")}
									></span>
								</label>
								<div className="btn-area">
									<button
										className="cancel btn"
										onClick={() => setIsOpen(false)}
									>
										{t("cancel")}
									</button>
									<button
										type="submit"
										className="confirm btn"
										disabled={!isChecked}
									>
										{t("confirm")}
									</button>
								</div>
							</form>
						)}
					</dialog>
				</>
			)}
		</>
	);
}
