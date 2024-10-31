import React from "react";
import { closeIcon } from "./icons";

export default function SuccessModal({ isVisible, setIsVisible }) {
	if (!isVisible) return null;
	return (
		<dialog open={isVisible} id="success-dialog">
			<button className="btn cancel" onClick={() => setIsVisible(false)}>
				{closeIcon}
			</button>
			<h3>Upload Successful</h3>
			<p>Thank you for your contribution!</p>
		</dialog>
	);
}
