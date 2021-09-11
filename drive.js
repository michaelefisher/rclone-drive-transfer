#! /usr/bin/env node

import fs from 'fs';
import YAML from 'yaml';
import rclone from 'rclone.js';
/* This file uses the system's install rclone to manipulate data
 * in Google Drive
 *
 * Essentially, we're going to do something like this:
 * rclone copy -vv fishermichaele_gmail_com:Test\ shared\ folder michael_fisher_asceta_co_technology:Test\ shared\ folder --drive-server-side-across-configs -P
 *
 * ...but it is going to be more readable!
 *
 */

// TODO: Set drive-server-side-across-configs automatically
// if src and dest are drive

const help = "Usage:\n\n./drive.js command configFile [...args]\n\n";

const commands = process.argv.slice(2);
if (commands.length > 0
    && !commands[0].includes('sync')
    && !commands[0].includes('copy')
    && !commands[0].includes('ls')
    && !commands[0].includes('check')
  ) {
  console.error("Right now, command must be ls or sync or copy or check.\n\n" + help);
  process.exit(1);
}

let configFileName;
let configFile;
if (commands[1] && commands[1] != "") {
  configFileName = fs.readFileSync(commands[1], 'utf-8');
} else {
  console.log("No config file given. Please supply as second argument.\n\n" + help);
  process.exit(1);
}

let fromBackend;
let fromPath;
let toBackend;
let toPath;

let excludeItems;
const runCommand = (cliCommand, commandFrom, commandTo, excludeItems) => {
  // These are default args
  let args = [
    "--log-level=DEBUG",
   `--exclude=${excludeItems.join(" ")}`,
    "--dry-run"
  ]

  let extraArgs;
  // If there are additional args
  if (commands.length > 1) {
    extraArgs = commands.slice(2)
    args = args.concat(extraArgs);
  }

  let command;
  if (cliCommand) {
    if (cliCommand == "sync") {
      command = rclone.sync(
        commandFrom,
        commandTo,
        ...args
      );
    } else if (cliCommand == "copy") {
      command = rclone.copy(
        commandFrom,
        commandTo,
        ...args
      );
    } else if (cliCommand == "ls") {
      command = rclone.ls(
        commandFrom,
        ...args
      );
    } else if (cliCommand == "check") {
      command = rclone.check(
        commandFrom,
        commandTo,
        '--one-way'
      );
    }
    return command;
  }
}

const file = YAML.parse(configFileName);
const list = file.mapping;
for (let item in list) {
  const values = list[item];

  fromBackend = values.from_backend;
  fromPath = values.from_path;
  toBackend = values.to_backend;
  toPath = values.to_path;

  const excludeList = values.exclude;
  excludeItems = (excludeList) ? excludeList : [];

  const cliCommand = commands[0];

  if (cliCommand) {
    const command = runCommand(cliCommand,
                              `${fromBackend}` + ':' + `${fromPath}`,
                              `${toBackend}` + ':' + `${toPath}`,
                              excludeItems
                              );

    command.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    command.stderr.on("data", (data) => {
      console.error(data.toString());
    });
  }
}

