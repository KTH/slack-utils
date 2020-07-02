const fs = require("fs");
const path = require("path");
const readline = require("readline");

function getDataDirectory() {
  if (process.env.DATA_DIRECTORY) {
    return path.resolve(__dirname, process.env.DATA_DIRECTORY);
  }
  return path.resolve(__dirname, "../data");
}

function getResultsDirectory(filename) {
  if (process.env.RESULTS_DIRECTORY) {
    return path.resolve(__dirname, process.env.RESULTS_DIRECTORY);
  }
  return path.resolve(__dirname, "../data/results");
}

function getFile(filename, path) {
  return `${path}/${filename}`;
}

async function lines(filename) {
  result = [];

  let readLine = readline.createInterface({
    input: fs.createReadStream(getFile(filename, getDataDirectory())),
    console: false,
  });

  for await (const line of readLine) {
    result.push(line);
  }
  return result;
}

async function readUsers(filename) {
  let result = [];
  let usersLines = await lines(filename);
  usersLines.forEach((line) => {
    let user = toArray(line);
    if (isActive(user)) {
      result.push(user);
    }
  });
  return result;
}

function isActive(user) {
  //index 2 is status
  if (user[2] == "Deactivated") {
    console.log(`${user[1]} is Deactivated`);
    return false;
  }
  return true;
}

function toArray(line, splitter = ",") {
  return line.split(splitter).map(function (value) {
    return value.trim();
  });
}

function write(filename, content) {
  fs.writeFile(getFile(filename, getResultsDirectory()), content, function (
    err
  ) {
    if (err) {
      return console.error(err);
    }
  });
}

module.exports = {
  readUsers: readUsers,
  write: write,
};
