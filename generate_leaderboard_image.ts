import { CanvasRenderingContext2D, createCanvas, registerFont } from "canvas";
import fs from "fs";

registerFont("Lexend.ttf", { family: "Lexend" });

function fittingString(
  c: CanvasRenderingContext2D,
  str: string,
  maxWidth: number,
) {
  var width = c.measureText(str).width;
  var ellipsis = "…";
  var ellipsisWidth = c.measureText(ellipsis).width;
  if (width <= maxWidth || width <= ellipsisWidth) {
    return str;
  } else {
    var len = str.length;
    while (width >= maxWidth - ellipsisWidth && len-- > 0) {
      str = str.substring(0, len);
      width = c.measureText(str).width;
    }
    return str + ellipsis;
  }
}

function generateLeaderboardImage(
  entries: { user: { username: string; avatarURL: string }; score: number }[],
) {
  const canvas = createCanvas(700, 1000);
  const ctx = canvas.getContext("2d");
  ctx.font = "30px Lexend";
  //ctx.fillStyle = '#000000';

  for (let i = 0; i < entries.length; i++) {
    let usernameMeasurement = ctx.measureText(entries[i].user.username);
    let usernameHeight =
      usernameMeasurement.actualBoundingBoxAscent +
      usernameMeasurement.actualBoundingBoxDescent;
    switch (i) {
      case 0: // Podium 1
        ctx.fillText(
          fittingString(ctx, entries[i].user.username, 250),
          canvas.width / 2 - usernameMeasurement.width / 2,
          usernameHeight + 10,
        );
        break;
      case 1: // Podium 2
        ctx.fillText(
          fittingString(ctx, entries[i].user.username, 250),
          10,
          usernameHeight + 10,
        );
        break;
      case 2: // Podium 3
        ctx.fillText(
          fittingString(ctx, entries[i].user.username, 250),
          canvas.width - usernameMeasurement.width - 10,
          usernameHeight + 10,
        );
        break;
      default: // Runnerups
        break;
    }
  }

  fs.writeFileSync("test.png", canvas.toBuffer());
  return canvas.toDataURL();
}

generateLeaderboardImage([
  {
    user: {
      username: "Wissididom 1",
      avatarURL:
        "https://cdn.discordapp.com/avatars/583803514493337611/a_57489f3ebb8dc846dd0ad66f0d186851.webp",
    },
    score: 1,
  },
  {
    user: {
      username: "Wissididom 2",
      avatarURL:
        "https://cdn.discordapp.com/avatars/583803514493337611/a_57489f3ebb8dc846dd0ad66f0d186851.webp",
    },
    score: 2,
  },
  {
    user: {
      username: "Wissididom 3",
      avatarURL:
        "https://cdn.discordapp.com/avatars/583803514493337611/a_57489f3ebb8dc846dd0ad66f0d186851.webp",
    },
    score: 3,
  },
  {
    user: {
      username: "Wissididom 4",
      avatarURL:
        "https://cdn.discordapp.com/avatars/583803514493337611/a_57489f3ebb8dc846dd0ad66f0d186851.webp",
    },
    score: 4,
  },
  {
    user: {
      username: "Wissididom 5",
      avatarURL:
        "https://cdn.discordapp.com/avatars/583803514493337611/a_57489f3ebb8dc846dd0ad66f0d186851.webp",
    },
    score: 5,
  },
]);
