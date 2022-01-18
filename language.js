async function getLanguage(guildId, data) {
	const languageCode = await data.getLanguageCode(guildId);
	const language = require(`./languages/${languageCode}.json`);
	return {
		code: languageCode,
		obj: language
	};
}


module.exports.getLanguage = getLanguage;
