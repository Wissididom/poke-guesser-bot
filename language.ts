import Database from "./data/postgres";

export default class Language {

    static async getLanguage(guildId: string, db: Database) {
        let languageCode = await db.getLanguageCode(guildId);
        let language: {[key: string]: string} = require(`./languages/${languageCode}.json`);
        return {
            code: languageCode,
            obj: language
        };
    }
}
