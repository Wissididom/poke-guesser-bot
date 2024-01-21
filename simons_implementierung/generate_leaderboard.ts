const screenshot = require("./screenshot.js");

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">

	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lexend">
	<link rel="stylesheet" href="https://cdn.discordapp.com/attachments/668221739813044255/906938811987165204/index.css">
	<title>Leaderboard</title>
</head>
<body>
	<div class="background-wrapper">
		<div class="podium">
			{{podium}}
		</div>
		<div class="runner-up-card">
			<label class="runner-up-title">Runner up's</label>
			{{runnerUps}}
		</div>
	</div>
</body>
</html>`;

/**
 * Expects a list of leaderboard entries in the following form:
 *
 * {
 * 	user: User,
 * 	score: number
 * }
 *
 * @returns The generated image as png buffer.
 */
async function generateLeaderboard(entries) {
  let first = generatePodiumEntry(entries[0], 1);
  let second = generatePodiumEntry(entries[1], 2);
  let third = generatePodiumEntry(entries[2], 3);

  let runnerUpEntries = generateRunnerUpEntries(entries.slice(3));

  let output = htmlTemplate
    .replace(/\{\{podium\}\}/, first + second + third)
    .replace(/\{\{runnerUps\}\}/, runnerUpEntries);

  return await screenshot.makeScreenshot(output, ".background-wrapper");
}

/**
 * Generates html for the podium entry.
 * @param position The position of the entry in the leaderboard. Can be either 1, 2 or 3.
 *                 If the position is not 1, 2 or 3 the function returns the empty string.
 */
function generatePodiumEntry(entry, position) {
  let inner = "";
  let positionClass = "";

  switch (position) {
    case 1:
      positionClass = "first-place";
      break;
    case 2:
      positionClass = "second-place";
      break;
    case 3:
      positionClass = "third-place";
      break;
    default:
      return "";
  }

  if (entry != null && entry != undefined) {
    inner = `<label class="podium-username">${getSanitizedUsername(entry)}</label>
			<label class="podium-profile-pic profile-pic" style="background-image: url(${entry.user.avatarUrl()})"></label>
			<label class="podium-score">${entry.score}</label>`;
  }

  return `<div class="pod-position ${positionClass}">${inner}</div>`;
}

/**
 * Generates html for the runner up entries.
 */
function generateRunnerUpEntries(entries) {
  let retVal = "";

  for (let i = 0; i < entries.length; i++) {
    retVal += generateRunnerUpEntry(entries[i], i + 4);
  }

  return retVal;
}

function generateRunnerUpEntry(entry, position) {
  let inner = "";
  if (entry != null && entry != undefined) {
    inner = `<label class="runner-up-position">${position}</label>
			<label class="runner-up-profile-pic profile-pic" style="background-image: url(${entry.user.avatarUrl()})"></label>
			<label class="runner-up-username">${getSanitizedUsername(entry)}</label>
			<label class="runner-up-score">${entry.score}</label>`;
  }

  return `<div class="runner-up-entry">${inner}</div>`;
}

/**
 * '<' or '>' characters would break our generated html. We need to html-escape those.
 */
function getSanitizedUsername(entry) {
  let username = entry.user.username;

  username = username.replace("<", "&lt;");
  username = username.replace(">", "&gt;");

  return username;
}

module.exports.generateLeaderboard = generateLeaderboard;
