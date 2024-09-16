import Alpine from "alpinejs";
import * as JSZip from "jszip";
import { slugify } from "./utils.js";
import React, { useEffect, useCallback } from "react";

export const colourPalette = [
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

export function FileParser({ file, ...dataDisplayProps }) {
	const { setMapData, showMap, setFileToParse } = dataDisplayProps;

	const setDataDisplayMap = useCallback(
		(data, name, imgZip = null) => {
			setMapData({ data: data, imgZip: imgZip });
			updateMapdata(name);
			showMap();
		},
		[setMapData, showMap, setFileToParse]
	);

	useEffect(() => {
		if (file) {
			processFile(file, setDataDisplayMap);
		}
	}, [file]); // run when file changes

	return null; //don't render anything
}

export const allowedExtensions = [".zip", ".txt", ".geojson"];

const processFile = (file, setDataDisplayMap) => {
	// process the file then call setDataDisplayMap

	if (
		file instanceof File &&
		allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
	) {
		try {
			const reader = new FileReader();

			if (file.name.endsWith(".zip")) {
				const zip = new JSZip();
				zip.loadAsync(file).then(function (contents) {
					const filenames = Object.keys(contents.files);
					const chatFilename = filenames.filter((filename) =>
						filename.match(/.*\.txt/)
					)[0];
					const imgFilenames = filenames.filter((filename) =>
						filename.match(/.*\.(jpg|jpeg|png|gif)$/i)
					);
					if (imgFilenames.length > 0) {
						console.log("images found");
					}
					// if there is a chat file, process it and any images
					if (chatFilename) {
						// process the chat file and pass along any images
						zip
							.file(chatFilename)
							.async("string")
							.then(function (fileContent) {
								const [data, name] = processText(fileContent);
								setDataDisplayMap(data, name, zip);
							});
					}
				});
			} else {
				// text or geojson
				reader.readAsText(file);
				reader.onloadend = function (e) {
					const content = e.target.result;
					const geoJSONRegex = /^\s*{\s*"type"/;
					// will process as geojson if extension is .geojson or if content starts with { "type"
					if (file.name.endsWith(".geojson") || geoJSONRegex.test(content)) {
						try {
							const [data, name] = processGeoJson(content);
							setDataDisplayMap(data, name);
						} catch (error) {
							console.error("Error parsing GeoJSON:", error);
						}
					} else {
						const [data, name] = processText(e.target.result);
						setDataDisplayMap(data, name);
					}
				};
			}
		} catch (error) {
			console.error("Unsupported file or format", error);
		}
	}
};

const getSenderColour = (senders) => {
	// Select a colour depending on number of keys in the object provided
	return colourPalette[Object.keys(senders).length % colourPalette.length];
};

const formatDateString = (date, time) => {
	// Given strings representing a date (dd/mm/yyyy) and
	// time (hh:mm:ss) return a datetime object
	// Check if time includes AM/PM to determine the format
	const is12HourFormat =
		time.toLowerCase().includes("am") || time.toLowerCase().includes("pm");
	let hour, min, sec;
	let [day, month, year] = date.split("/");
	if (is12HourFormat) {
		// Handle 12-hour format
		let [timePart, meridiem] = time.toLowerCase().split(" ");
		[hour, min, sec = "00"] = timePart.split(":");

		// Convert 12-hour to 24-hour format
		if (meridiem === "pm" && hour !== "12") {
			hour = parseInt(hour, 10) + 12;
		} else if (meridiem === "am" && hour === "12") {
			hour = "00";
		}
	} else [hour, min, sec = "00"] = time.split(":"); // 24hr format used already

	return `${year}-${month}-${day}T${hour}:${min}:${sec}`;
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

	// Check the first 3 characters to determine the format; iOS and Android
	const fileType = text.substring(0, 3);
	let messageRegex;
	let imgFileRegex;

	// Regex matches a single message including newline characters,
	// stopping when new line starts with date or text ends
	// also accounts for if the datetime is wrapped in brackets and has s
	// Capture group 1 = date, group 2 = time, group 3 = sender, group 4 = message content
	// this has been tweaked for each format but gives the same output
	// TODO: pass along which format to the map so it knows how to find images
	if (fileType.match(/\[\d{2}/)) {
		console.info("ios format");
		// iOS format
		messageRegex =
			/\[(\d{2}\/\d{2}\/\d{4}),\s(\d{1,2}:\d{2}:\d{2}\s(?:AM|PM))\]\s(.*?):\s(.+?)(?=\n\[|$)/gs;
		imgFileRegex =
			/(?:\(file attached\)|‎<attached: )([\w\-_]+\.(jpg|jpeg|png|gif))/i;
	} else if (fileType.match(/\d{2}\//)) {
		console.info("android format");
		// Android format
		messageRegex =
			/(\d{2}\/\d{2}\/\d{4}),?\s(\d{1,2}:\d{2})(?:\s?(?:AM|PM|am|pm))?\s-\s(.*?):[\t\f\cK ]((.|\n)*?)(?=(\n\d{2}\/\d{2}\/\d{4})|$)/g;
		// Regex to match and capture image filenames in messages
		imgFileRegex = /\b([\w\-_]*\.(jpg|jpeg|png|gif))\s\(file attached\)/;
	} else {
		console.error("Unknown file format");
		return [null, groupName];
	}

	let messageMatches = [...text.matchAll(messageRegex)];
	// Regex to match google maps location and capture lat (group 1) and long (group 2)
	const locationRegex =
		/: https:\/\/maps\.google\.com\/\?q=(-?\d+\.\d+),(-?\d+\.\d+)/; //Without 'location' to be universal - the word in the export file changes based on WA language

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
		let imgFileMatch = imgFileRegex.exec(message.content);
		if (imgFileMatch) {
			message.imgFilename = imgFileMatch[1];
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
					imgFilenames: [],
				},
			};
			if (message.location) {
				feature.geometry = {
					type: "Point",
					coordinates: [message.location.long, message.location.lat], // GeoJSON uses [long, lat] order
				};
			}
		} else if (feature) {
			// if message contains an image filename add it to feature imageFilenames property
			if (message.imgFilename) {
				feature.properties.imgFilenames.push(message.imgFilename);
			} else if (
				// Append message content to observations unless it's media omitted or message deleted
				!message.content.includes("<Media omitted>") &&
				!message.content.includes("This message was deleted")
			) {
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
