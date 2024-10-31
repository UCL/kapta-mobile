export const slugify = (str) => {
	str = str.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space
	str = str.toLowerCase();
	str = str
		.replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
		.replace(/\s+/g, "-") // replace spaces with hyphens
		.replace(/-+/g, "-"); // remove consecutive hyphens
	return str;
};

export const generateCampaignCode = () => {
	// generate 6 character alphanumeric access code
	return crypto.randomUUID().replace(/-/g, "").substring(0, 6).toUpperCase();
};
