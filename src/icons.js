import { library, icon } from "@fortawesome/fontawesome-svg-core";
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
export const chevronDown = icon({
	prefix: "fas",
	iconName: "chevron-down",
}).html;
export const chevronUp = icon({ prefix: "fas", iconName: "chevron-up" }).html;
export const imageIcn = icon({ prefix: "fas", iconName: "image" }).html;
export const shareIcn = icon({
	prefix: "fas",
	iconName: "share-nodes",
}).html;
export const dataIcn = icon({ prefix: "fas", iconName: "file-code" }).html;
export const addMetaIcn = icon({
	prefix: "fas",
	iconName: "file-circle-plus",
}).html;
export const uploadIcn = icon({
	prefix: "fas",
	iconName: "cloud-arrow-up",
}).html;
export const GPSIcn = icon({
	prefix: "fas",
	iconName: "location-crosshairs",
}).html;
export const basemapSatIcon = icon({ prefix: "fas", iconName: "sun" }).html;
export const basemapDarkIcon = icon({ prefix: "fas", iconName: "moon" }).html;
export const exitButtonIcon = icon({
	prefix: "fas",
	iconName: "arrow-left",
}).html;
export const GPSPositionIcn = icon({
	prefix: "fas",
	iconName: "dot-circle",
}).html;
export const closeIcon = icon({ prefix: "fas", iconName: "x" }).html;

export const thumbsUpIcon = icon({ prefix: "fas", iconName: "thumbs-up" }).html;

export const msgIcon = icon({ prefix: "fas", iconName: "message" }).html;
