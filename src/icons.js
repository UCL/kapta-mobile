import { library, icon } from "@fortawesome/fontawesome-svg-core";
import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronDown,
	faChevronUp,
	faImage,
	faShareNodes,
	faFileCode,
	faFileCirclePlus,
	faForwardStep,
	faCloudArrowUp,
	faLocationCrosshairs,
	faSun,
	faMoon,
	faArrowLeft,
	faDotCircle,
	faX,
	faThumbsUp,
	faMessage,
	faBars,
	faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";

// Add fontawesome icons to library
library.add(
	faChevronDown,
	faChevronUp,
	faImage,
	faShareNodes,
	faFileCode,
	faFileCirclePlus,
	faForwardStep,
	faCloudArrowUp,
	faLocationCrosshairs,
	faSun,
	faMoon,
	faArrowLeft,
	faDotCircle,
	faX,
	faThumbsUp,
	faMessage,
	faBars,
	faGithub,
	faInfoCircle
);
// we use .btn-icon but there is no global styling for it, only ever nested,
// which allows for easy selecting and flexible styling
export const chevronDown = <FontAwesomeIcon icon={faChevronDown} />;
export const chevronUp = <FontAwesomeIcon icon={faChevronUp} />;
export const nextIcn = <FontAwesomeIcon icon={faForwardStep} />;
export const imageIcn = <FontAwesomeIcon icon={faImage} className="btn-icon" />;
export const shareIcn = <FontAwesomeIcon icon={faShareNodes} />;
export const dataIcn = (
	<FontAwesomeIcon icon={faFileCode} className="btn-icon" />
);
export const addMetaIcn = (
	<FontAwesomeIcon
		icon={faFileCirclePlus}
		style={{ fontSize: "0.75rem" }}
		className="btn-icon"
	/>
);
export const uploadIcn = (
	<FontAwesomeIcon icon={faCloudArrowUp} className="btn-icon" />
);
export const GPSIcn = <FontAwesomeIcon icon={faLocationCrosshairs} />;
export const basemapSatIcon = <FontAwesomeIcon icon={faSun} />;
export const basemapDarkIcon = <FontAwesomeIcon icon={faMoon} />;
export const exitButtonIcon = (
	<FontAwesomeIcon icon={faArrowLeft} className="btn-icon" />
);
export const GPSPositionIcn = icon({
	prefix: "fas",
	iconName: "dot-circle",
}).html;
export const closeIcon = <FontAwesomeIcon icon={faX} className="btn-icon" />;

export const thumbsUpIcon = (
	<FontAwesomeIcon icon={faThumbsUp} className="btn-icon" />
);
export const msgIcon = (
	<FontAwesomeIcon icon={faMessage} className="btn-icon" />
);

// menu
export const menuIcon = <FontAwesomeIcon icon={faBars} />;
export const GHIcon = <FontAwesomeIcon icon={faGithub} />;
