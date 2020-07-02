const fs = require("fs");
const path = require("path");
const readline = require("readline");
const fileUtil = require("./fileUtil");

async function separate(filename) {
  let kthseAccounts = [
    "# Active users (admins, members or owners) with a kth.se-account",
  ];
  let kthseAccountsSingleChannel = [
    "# Active users that are single channel members only, and registred using a kth.se-account.",
  ];
  let kthDomains = [
    "# Active users (admins, members or owners) with faculty email like @abe.kth.se.",
  ];
  let kthDomainsSingleChannel = [
    "# Active users that are single channel members only with faculty email like @abe.kth.se.",
  ];
  let externalDomains = [
    "# Active users (admins, members or owners) using an external e-mail (not kth.se).",
  ];
  let externalDomainsSingleChannel = [
    "# Active users that are single channel members only and registred using a external domain (not kth.se).",
  ];
  let bots = [];

  let users = await fileUtil.readUsers(filename);

  users.forEach((user) => {
    const email = getEmail(user);
    if (isSingleChannelGuest(user)) {
      if (email.includes("@kth.se")) {
        kthseAccountsSingleChannel.push(email.substring(0, email.indexOf("@")));
      } else if (email.includes(".kth.se")) {
        kthDomainsSingleChannel.push(email);
      } else {
        externalDomainsSingleChannel.push(email);
      }
    } else {
      if (email.includes("@kth.se")) {
        kthseAccounts.push(email.substring(0, email.indexOf("@")));
      } else if (email.includes(".kth.se")) {
        kthDomains.push(email);
      } else if (email.includes("slack-bots.com")) {
        bots.push(email);
      } else {
        externalDomains.push(email);
      }
    }
  });
  fileUtil.write("kthse-account.txt", kthseAccounts.join("\n"));
  fileUtil.write("kth-domains.txt", kthDomains.join("\n"));
  fileUtil.write("external-domains.txt", externalDomains.join("\n"));

  fileUtil.write(
    "kthse-account-single-channel-member.txt",
    kthseAccountsSingleChannel.join("\n")
  );
  fileUtil.write(
    "kth-domains-single-channel-member.txt",
    kthDomainsSingleChannel.join("\n")
  );
  fileUtil.write(
    "external-domains-single-channel-member.txt",
    externalDomainsSingleChannel.join("\n")
  );

  fileUtil.write("bots.txt", bots.join("\n"));

  return result;
}

function getEmail(user) {
  // Column 1 is email.
  return user[1];
}

function isHeaderRow(lineNumber) {
  return lineNumber == 0;
}

function isSingleChannelGuest(user) {
  //index 2 is status
  if (user[2].includes("Single-Channel Guest")) {
    return true;
  }
  return false;
}

function isMultiChannelGuest(user) {
  //index 2 is status
  if (user[2].includes("Multi-Channel Guest")) {
    return true;
  }
  return false;
}

module.exports = {
  separate: separate,
};
