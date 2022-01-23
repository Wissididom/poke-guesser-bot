async function getLanguage(guildId, db) {
	const languageCode = await db.getLanguageCode(guildId);
	const language = require(`./languages/${languageCode}.json`);
	return {
		code: languageCode,
		obj: language
	};
}


module.exports.getLanguage = getLanguage;
