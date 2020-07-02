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
  let kthseAccountsMultiChannel = [
    "# Active users that are multi channel members, and registred using a kth.se-account.",
  ];
  let kthDomains = [
    "# Active users (admins, members or owners) with faculty email like @abe.kth.se.",
  ];
  let kthDomainsSingleChannel = [
    "# Active users that are single channel members only with faculty email like @abe.kth.se.",
  ];
  let kthDomainsMultiChannel = [
    "# Active users that are multi channel members with faculty email like @abe.kth.se.",
  ];
  let externalDomains = [
    "# Active users (admins, members or owners) using an external e-mail (not kth.se).",
  ];
  let externalDomainsSingleChannel = [
    "# Active users that are single channel members only and registred using a external domain (not kth.se).",
  ];
  let externalDomainsMultiChannel = [
    "# Active users that are multi channel members and registred using a external domain (not kth.se).",
  ];
  let bots = ["# Configured bots."];

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
    } else if (isMultiChannelGuest(user)) {
      if (email.includes("@kth.se")) {
        kthseAccountsMultiChannel.push(email.substring(0, email.indexOf("@")));
      } else if (email.includes(".kth.se")) {
        kthDomainsMultiChannel.push(email);
      } else {
        externalDomainsMultiChannel.push(email);
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

  // Regular users
  fileUtil.write("kthse-account.txt", kthseAccounts.join("\n"));
  console.log(
    `${new Date()} - ${kthseAccounts[0]} - ${kthseAccounts.length} users.`
  );

  fileUtil.write("kth-domains.txt", kthDomains.join("\n"));
  console.log(`${new Date()} - ${kthDomains[0]} - ${kthDomains.length} users.`);

  fileUtil.write("external-domains.txt", externalDomains.join("\n"));
  console.log(
    `${new Date()} - ${externalDomains[0]} - ${externalDomains.length} users.`
  );

  // Single channels
  fileUtil.write(
    "kthse-account-single-channel-member.txt",
    kthseAccountsSingleChannel.join("\n")
  );
  console.log(
    `${new Date()} - ${kthseAccountsSingleChannel[0]} - ${
      kthseAccountsSingleChannel.length
    } users.`
  );
  fileUtil.write(
    "kth-domains-single-channel-member.txt",
    kthDomainsSingleChannel.join("\n")
  );
  console.log(
    `${new Date()} - ${kthDomainsSingleChannel[0]} - ${
      kthDomainsSingleChannel.length
    } users.`
  );

  fileUtil.write(
    "external-domains-single-channel-member.txt",
    externalDomainsSingleChannel.join("\n")
  );
  console.log(
    `${new Date()} - ${externalDomainsSingleChannel[0]} - ${
      externalDomainsSingleChannel.length
    } users.`
  );

  // Multi channel
  fileUtil.write(
    "kthse-account-multi-channel-member.txt",
    kthseAccountsMultiChannel.join("\n")
  );
  console.log(
    `${new Date()} - ${kthseAccountsMultiChannel[0]} - ${
      kthseAccountsMultiChannel.length
    } users.`
  );
  fileUtil.write(
    "kth-domains-multi-channel-member.txt",
    kthDomainsMultiChannel.join("\n")
  );
  console.log(
    `${new Date()} - ${kthDomainsMultiChannel[0]} - ${
      kthDomainsMultiChannel.length
    } users.`
  );

  fileUtil.write(
    "external-domains-multi-channel-member.txt",
    externalDomainsMultiChannel.join("\n")
  );
  console.log(
    `${new Date()} - ${externalDomainsMultiChannel[0]} - ${
      externalDomainsMultiChannel.length
    } users.`
  );

  // Bots
  fileUtil.write("bots.txt", bots.join("\n"));
  console.log(`${new Date()} - ${bots[0]} - ${bots.length} users.`);

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
