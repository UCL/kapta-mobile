import React, { useEffect } from "react";

export default function Loader({ isVisible, setIsVisible }) {
	if (!isVisible) return null;

	useEffect(() => {
		let timer = setTimeout(() => {
			setIsVisible(false);
		}, 2000);

		// Clean up the timer if the component is unmounted or if `isVisible` changes
		return () => clearTimeout(timer);
	}, [isVisible, setIsVisible]);

	return <div id="loader" className="loader"></div>;
}
