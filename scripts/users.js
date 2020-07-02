const fs = require("fs");
const path = require("path");
const readline = require("readline");
const fileUtil = require("./fileUtil");

async function separate(filename) {
  let usernames = [];
  let bots = [];
  let kthOtherDomains = [];
  let other = [];
  let users = await fileUtil.readUsers(filename);
  users.forEach((user) => {
    const email = getEmail(user);
    if (email.includes("@kth.se")) {
      kthOtherDomains.push(email.substring(0, email.indexOf("@")));
    } else if (email.includes(".kth.se")) {
      kthOtherDomains.push(email);
    } else if (email.includes("slack-bots.com")) {
      bots.push(email);
    } else {
      other.push(email);
    }
  });
  fileUtil.write("users-usernames.txt", usernames.join("\n"));
  fileUtil.write("users-kth-domains.txt", kthOtherDomains.join("\n"));
  fileUtil.write("users-bots.txt", bots.join("\n"));
  fileUtil.write("users-external-email.txt", other.join("\n"));
  return result;
}

function getEmail(user) {
  // Column 1 is email.
  return user[1];
}

function isHeaderRow(lineNumber) {
  return lineNumber == 0;
}

module.exports = {
  separate: separate,
};
