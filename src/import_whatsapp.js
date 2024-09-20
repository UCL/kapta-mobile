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

const cleanMsgContent = (content, location, imgFileRegex) => {
	// Clean remaining content by removing images and location references
	content = content
		.split("\n")
		.map((line) => {
			// go line by line, remove whitespace and remove images and location references, replacing with a placeholder to maintain message structure and organisation
			// if these are removed the message order is messed up and it's hard to match them up with the correct location and content
			line = line.trim();
			if (location && line.includes(location[0])) {
				return (location[0] = "\nremove_this_msg\n"); // setting this up for removal later
			}
			if (line.match(imgFileRegex)) {
				return "\nremove_this_msg\n";
			}
			return line;
		})
		.filter(
			(line) =>
				line &&
				// ignore lines with the following content, they aren't included with other content
				!line.includes("image omitted") &&
				!line.includes("<Media omitted>") &&
				!line.includes("This message was deleted") &&
				!line.includes("You deleted this message") &&
				!line.includes(
					"Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them."
				)
		)
		.join("\n");
	return content;
};

const processMsgMatches = (messageMatches, imgFileRegex) => {
	// Process each message match, extracting the sender, location and img filenames before cleaning
	// this returns an array of messages
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
		var location = locationRegex.exec(message.content);
		if (location) {
			message.location = {
				lat: parseFloat(location[1]),
				long: parseFloat(location[2]),
			};
		}
		let imgFileMatches = [...message.content.matchAll(imgFileRegex)];
		if (imgFileMatches.length > 0) {
			let imgMatches = [];
			for (const match of imgFileMatches) {
				imgMatches.push(match[1]);
			}
			message.imgFilenames = imgMatches;
		}
		message.content = cleanMsgContent(message.content, location, imgFileRegex);
		messages.push(message);
	});
	return [messages, senders];
};

// Regex to match google maps location and capture lat (group 1) and long (group 2)
const locationRegex =
	/: https:\/\/maps\.google\.com\/\?q=(-?\d+\.\d+),(-?\d+\.\d+)/; //Without 'location' to be universal - the word in the export file changes based on WA language

const setImgMsgRegex = (fileType) => {
	let messageRegex;
	let imgFileRegex;
	// Regex matches a single message including newline characters,
	// stopping when new line starts with date or text ends
	// also accounts for if the datetime is wrapped in brackets and has s
	// Capture group 1 = date, group 2 = time, group 3 = sender, group 4 = message content
	// this has been tweaked for each format but gives the same output
	if (fileType.match(/\[\d{2}/)) {
		// console.info("ios format");
		// iOS format
		messageRegex =
			/\[(\d{2}\/\d{2}\/\d{4}),\s(\d{1,2}:\d{2}:\d{2}\s(?:AM|PM))\]\s(.*?):\s(.+?)(?=\n\[|$)/gs;
		imgFileRegex = /<attached: (\d+-[\w\-_]+\.(jpg|jpeg|png|gif))>/gim;
	} else if (fileType.match(/\d{2}\//)) {
		// console.info("android format");
		// Android format
		messageRegex =
			/(\d{2}\/\d{2}\/\d{4}),?\s(\d{1,2}:\d{2})(?:\s?(?:AM|PM|am|pm))?\s-\s(.*?):[\t\f\cK ]((.|\n)*?)(?=(\n\d{2}\/\d{2}\/\d{4})|$)/g;
		// Regex to match and capture image filenames in messages
		imgFileRegex = /\b([\w\-_]*\.(jpg|jpeg|png|gif))\s\(file attached\)/gim;
	} else {
		console.error("Unknown file format");
		return [null, groupName];
	}
	return [messageRegex, imgFileRegex];
};

const sortMessages = (messages) => {
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
	return messages;
};

const processText = (text) => {
	const groupNameRegex = /"([^"]*)"/;
	const groupNameMatches = text.match(groupNameRegex);
	const groupName = groupNameMatches ? groupNameMatches[1] : null;

	// Check the first 3 characters to determine the format; iOS and Android
	const fileType = text.substring(0, 3);
	const [messageRegex, imgFileRegex] = setImgMsgRegex(fileType);

	let messageMatches = [...text.matchAll(messageRegex)];

	// Convert messageMatches to array of JSON objects and then sort
	let [messages, senders] = processMsgMatches(messageMatches, imgFileRegex);
	messages = sortMessages(messages);

	// Now loop through messages to create geojson for each location
	var mapdata = {
		type: "FeatureCollection",
		features: [],
	};
	let currentFeature = null;
	let currentSender = null;

	const createFeature = (message, groupName) => {
		return {
			type: "Feature",
			properties: {
				contributionid: crypto.randomUUID(),
				mainattribute: groupName,
				observations: "",
				observer: message.sender,
				datetime: message.datetime,
				markerColour: senders[message.sender],
				imgFilenames: [],
			},
			geometry: message.location
				? {
						type: "Point",
						coordinates: [message.location.long, message.location.lat],
				  }
				: null,
		};
	};

	const isValidContent = (content) => {
		// replace the edited message marker since it's attached to other content
		content = content.replace(/<This message was edited>/gi, "").trim();
		// return content that is not empty and has trimmed whitespace
		return content
			.split("\n")
			.map((line) => line.trim())
			.filter(Boolean)
			.join("\n");
	};

	messages.forEach((message) => {
		// if the content is valid and there is location or different sender, get the current feature or create a new one and push it to mapdata
		// we assign it to a variable to be sure the validated content is used
		const validContent = isValidContent(message.content);

		if (validContent) {
			if (message.location || message.sender !== currentSender) {
				if (currentFeature && currentFeature.geometry) {
					mapdata.features.push(currentFeature);
				}
				currentFeature = createFeature(message, groupName);
				currentSender = message.sender;
			}

			if (currentFeature) {
				if (message.imgFilenames) {
					currentFeature.properties.imgFilenames.push(...message.imgFilenames);
				}
				currentFeature.properties.observations += validContent + "\n";
			}
		}
	});
	// Push the last message to mapdata
	if (currentFeature) {
		mapdata.features.push(currentFeature);
	}
	return [mapdata, groupName];
};
