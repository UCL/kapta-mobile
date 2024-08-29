import Alpine from "alpinejs";
import { displayMap } from "./map.js";
import * as JSZip from "jszip";
import { removeOptionsMenu } from "./menu.js";
import { slugify } from "./utils.js";

var totalcontribmap = 0;
var username = localStorage.getItem("username");
var phone = localStorage.getItem("phone");
var timestamp = getTimestamp();
var filedisplayed = false;
const colourPalette = [
	"#d0160f",
	"#80bf4d",
	"#b38300",
	"#3aedc5",
	"#c65a00",
	"#5fd789",
	"#9ca303",
	"#36fffd",
];

function getTimestamp() {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}

function displayFile(file) {
	const setUIElements = () => {
		filedisplayed = true;
	};

	setUIElements();

	if (file.name.endsWith(".zip")) {
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);

		reader.onload = function (e) {
			const arrayBuffer = e.target.result;
			const zip = new JSZip();
			zip.loadAsync(arrayBuffer).then(function (contents) {
				Object.keys(contents.files).forEach(function (filename) {
					if (filename.endsWith(".txt")) {
						zip
							.file(filename)
							.async("string")
							.then(function (fileContent) {
								processText(fileContent);
							});
					}
				});
			});
		};
	} else if (file.name.endsWith(".txt")) {
		const reader = new FileReader();
		reader.readAsText(file);
		reader.onloadend = function (e) {
			processText(e.target.result);
		};
	} else if (file.name.endsWith(".geojson")) {
		const reader = new FileReader();
		reader.readAsText(file);
		reader.onloadend = function (e) {
			console.log(e.target.result);
			processGeoJson(e.target.result);
		};
	} else {
		console.error("Unsupported file format");
	}
}

function getSenderColour(senders) {
	// Select a colour depending on number of keys in the object provided
	return colourPalette[Object.keys(senders).length % colourPalette.length];
}

function formatDateString(date, time) {
	// Given strings representing a date (dd/mm/yyyy) and
	// time (hh:mm) return a datetime object
	// Check if time includes AM/PM to determine the format
	const is12HourFormat =
		time.toLowerCase().includes("am") || time.toLowerCase().includes("pm");
	let hour, min;
	let [day, month, year] = date.split("/");
	if (is12HourFormat) {
		// Handle 12-hour format
		let [timePart, meridiem] = time.toLowerCase().split(" ");
		[hour, min] = timePart.split(":");

		// Convert 12-hour to 24-hour format
		if (meridiem === "pm" && hour !== "12") {
			hour = parseInt(hour, 10) + 12;
		} else if (meridiem === "am" && hour === "12") {
			hour = "00";
		}
	} else [hour, min] = time.split(":"); // 24hr format used already

	return `${year}-${month}-${day}T${hour}:${min}:00`;
}

function displayLoader() {
	const loaderContainer = document.createElement("div");
	loaderContainer.id = "loader-container";
	const loader = document.createElement("div");
	loader.className = "loader";
	loaderContainer.appendChild(loader);
	document.querySelector("#main").appendChild(loaderContainer);
}

function removeLoader() {
	document.querySelector("#loader-container").remove();
}
function updateMapdata(mapdata, groupName = null) {
	Alpine.store("currentDataset").geoJSON = mapdata;
	if (groupName) {
		Alpine.store("currentDataset").slug = slugify(groupName);
	} else {
		Alpine.store("currentDataset").slug = slugify("Kapta");
	}

	removeOptionsMenu();
	displayLoader();
	setTimeout(() => {
		removeLoader();
		displayMap(Alpine.store("currentDataset").geoJSON);
	}, 2000);
}
function processGeoJson(json) {
	var mapdata = {
		type: "FeatureCollection",
		features: [],
	};
	let groupName;
	var geoJSONData = JSON.parse(json);

	if (geoJSONData.type === "FeatureCollection") {
		mapdata.features = mapdata.features.concat(geoJSONData.features);

		if (geoJSONData.name) groupName = geoJSONData.name;
	}

	updateMapdata(mapdata, groupName);
}

function processText(text) {
	const groupNameRegex = /"([^"]*)"/;
	const groupNameMatches = text.match(groupNameRegex);
	const groupName = groupNameMatches ? groupNameMatches[1] : null;

	// Regex matches a single message including newline characters,
	// stopping when new line starts with date or text ends
	// Capture group 1 = date, group 2 = time, group 3 = sender, group 4 = message content
	const messageRegex =
		/(\d{2}\/\d{2}\/\d{4}),?\s(\d{1,2}:\d{2})(?:\s?(?:AM|PM|am|pm))?\s-\s(.*?):\s((.|\n)*?)(?=(\n\d{2}\/\d{2}\/\d{4})|$)/g;

	let messageMatches = [...text.matchAll(messageRegex)];

	// Regex to match google maps location and capture lat (group 1) and long (group 2)
	const locationRegex =
		/: https:\/\/maps\.google\.com\/\?q=(-?\d+\.\d+),(-?\d+\.\d+)/g; //Without 'location' to be universal - the word in the export file changes based on WA language

	// Convert messageMatches to array of JSON objects
	let messages = [];
	let senders = {};
	messageMatches.forEach((match) => {
		let message = {
			datetime: formatDateString(match[1], match[2]),
			sender: match[3],
			content: match[4],
		};
		// If sender hasn't been seen before, select a colour for them
		if (!Object.keys(senders).includes(message.sender)) {
			senders[message.sender] = getSenderColour(senders);
		}
		let location = locationRegex.exec(message.content);
		if (location) {
			message.location = {
				lat: parseFloat(location[1]),
				long: parseFloat(location[2]),
			};
		}
		messages.push(message);
	});
	// Sort messages by sender, then by datetime
	messages.sort((a, b) =>
		a.sender > b.sender
			? 1
			: a.sender === b.sender
			? a.datetime > b.datetime
				? 1
				: -1
			: -1
	);

	// Now loop through messages to create geojson for each location
	var mapdata = {
		type: "FeatureCollection",
		features: [],
	};
	let feature = null;
	let currentSender = null;

	messages.forEach((message) => {
		// Sometimes sender changes but there's no location so add any features in progress
		if (message.sender != currentSender || message.location) {
			// Push any existing features to mapdata
			if (feature) {
				// Reject feature if it doesn't have geometry
				if (feature.geometry) {
					mapdata.features.push(feature);
				} else {
					feature = null;
				}
			}
			// Create new feature
			var contributionid = crypto.randomUUID();
			feature = {
				type: "Feature",
				properties: {
					contributionid: contributionid,
					mainattribute: groupName,
					observations: "",
					observer: message.sender,
					datetime: message.datetime,
					markerColour: senders[message.sender],
				},
			};
			if (message.location) {
				feature.geometry = {
					type: "Point",
					coordinates: [message.location.long, message.location.lat], // GeoJSON uses [long, lat] order
				};
			}
		} else if (feature) {
			// Append message content to observations unless it's media omitted
			if (!message.content.includes("<Media omitted>")) {
				feature.properties.observations += message.content + "\n";
			}
		}
		currentSender = message.sender;
	});
	// Push the last message to mapdata
	if (feature) {
		mapdata.features.push(feature);
	}
	updateMapdata(mapdata, groupName);
}

export { displayFile, processText };
