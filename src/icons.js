import { library } from "@fortawesome/fontawesome-svg-core";
import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronDown,
	faChevronUp,
	faImage,
	faShareNodes,
	faFileCode,
	faFileCirclePlus,
	faCloudArrowUp,
	faLocationCrosshairs,
	faSun,
	faMoon,
	faArrowLeft,
	faDotCircle,
	faX,
	faThumbsUp,
	faMessage,
} from "@fortawesome/free-solid-svg-icons";

// Add fontawesome icons to library
library.add(
	faChevronDown,
	faChevronUp,
	faImage,
	faShareNodes,
	faFileCode,
	faFileCirclePlus,
	faCloudArrowUp,
	faLocationCrosshairs,
	faSun,
	faMoon,
	faArrowLeft,
	faDotCircle,
	faX,
	faThumbsUp,
	faMessage
);
export const chevronDown = <FontAwesomeIcon icon={faChevronDown} />;
export const chevronUp = <FontAwesomeIcon icon={faChevronUp} />;
export const imageIcn = <FontAwesomeIcon icon={faImage} />;
export const shareIcn = <FontAwesomeIcon icon={faShareNodes} />;
export const dataIcn = <FontAwesomeIcon icon={faFileCode} />;
export const addMetaIcn = <FontAwesomeIcon icon={faFileCirclePlus} />;
export const uploadIcn = <FontAwesomeIcon icon={faCloudArrowUp} />;
export const GPSIcn = <FontAwesomeIcon icon={faLocationCrosshairs} />;
export const basemapSatIcon = <FontAwesomeIcon icon={faSun} />;
export const basemapDarkIcon = <FontAwesomeIcon icon={faMoon} />;
export const exitButtonIcon = <FontAwesomeIcon icon={faArrowLeft} />;
export const GPSPositionIcn = <FontAwesomeIcon icon={faDotCircle} />;
export const closeIcon = <FontAwesomeIcon icon={faX} />;

export const thumbsUpIcon = <FontAwesomeIcon icon={faThumbsUp} />;

export const msgIcon = <FontAwesomeIcon icon={faMessage} />;
