import Alpine from "alpinejs";
import * as JSZip from "jszip";
import { slugify } from "./utils.js";

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

const getTimestamp = () => {
	// what's this meant to be for?
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
};
var timestamp = getTimestamp();

const setDataDisplayMap = (data, name, imgPromises, dataDisplayProps) => {
	// common function used after parsing files
	const { setMapData, showMap } = dataDisplayProps;
	setMapData(data);
	updateMapdata(name);
	showMap();
};

export const parseFile = (file, dataDisplayProps) => {
	if (file.name.endsWith(".zip")) {
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);

		reader.onload = function (e) {
			const arrayBuffer = e.target.result;
			const zip = new JSZip();
			zip.loadAsync(arrayBuffer).then(function (contents) {
				filenames = Object.keys(contents.files)
				chatFilename = filenames.filter(filename => filename.match(/.*\.txt/));
				imgFilenames = filenames.filter(filename => filename.match(/.*\.(jpg|jpeg|png|gif)/));
				// if there is a chat file, process it and any images
				if (chatFilename.length > 0) {
					// if there are image files, unzip them and add them to an array
					if (imgFilenames.length > 0) {
						let imgPromises = imgFilenames.map((imgFilename) => {
							return zip
								.file(imgFilename)
								.async("blob")
								.then((blob) => {
									return {
										filename: imgFilename,
										blob: blob,
									};
								});
						});
					}
					// process the chat file and pass along any images
					zip
						.file(chatFilename[0])
						.async("string")
						.then(function (fileContent) {
							const [data, name] = processText(fileContent);
							setDataDisplayMap(data, name, imgPromises, dataDisplayProps);
						});
				}

			});
		};
	} else if (file.name.endsWith(".txt")) {
		const reader = new FileReader();
		reader.readAsText(file);
		reader.onloadend = function (e) {
			const [data, name] = processText(e.target.result);
			setDataDisplayMap(data, name, dataDisplayProps);
		};
	} else if (file.name.endsWith(".geojson")) {
		const reader = new FileReader();
		reader.readAsText(file);
		reader.onloadend = function (e) {
			const [data, name] = processGeoJson(e.target.result);
			setDataDisplayMap(data, name, dataDisplayProps);
		};
	} else {
		console.error("Unsupported file format");
	}
};

const getSenderColour = (senders) => {
	// Select a colour depending on number of keys in the object provided
	return colourPalette[Object.keys(senders).length % colourPalette.length];
};

const formatDateString = (date, time) => {
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
	} else[hour, min] = time.split(":"); // 24hr format used already

	return `${year}-${month}-${day}T${hour}:${min}:00`;
};

const updateMapdata = (groupName = null) => {
	// not sure how much this is utilised atm, may need to better incorporate
	if (groupName) {
		Alpine.store("currentDataset").slug = slugify(groupName);
	} else {
		Alpine.store("currentDataset").slug = slugify("Kapta");
	}
};

const processGeoJson = (json) => {
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
	return [mapdata, groupName];
};

const processText = (text) => {
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
		/: https:\/\/maps\.google\.com\/\?q=(-?\d+\.\d+),(-?\d+\.\d+)/g;

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
	messages.sort((a, b) => {
		// Compare by sender
		if (a.sender > b.sender) {
			return 1;
		} else if (a.sender < b.sender) {
			return -1;
		} else {
			// If sender is the same, compare by datetime
			if (a.datetime > b.datetime) {
				return 1;
			} else if (a.datetime < b.datetime) {
				return -1;
			} else {
				return 0; // Otherwise maintain relative order
			}
		}
	});

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
	return [mapdata, groupName];
};
