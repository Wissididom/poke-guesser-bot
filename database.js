const Database = require("@replit/database");

const originalGet = Database.prototype.get;

async function get(key, options) {
	return await originalGet.call(this, key, options).then((res) => {
		if (res.ok) {
			return res.value;
		} else {
			return res;
		}
	});
}

Database.prototype.get = get;

module.exports = Database;
