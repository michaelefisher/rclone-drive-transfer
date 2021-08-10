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
const commands = process.argv.slice(2);
if (commands &&
    !commands[0].includes('sync')
    && !commands[0].includes('copy')
    && !commands[0].includes('ls')
    && !commands[0].includes('check')
  ) {
  console.error('Right now, command must be ls or sync or copy or check.');
  process.exit(1);
}

let configFileName;
let configFile;
if (commands[1] != "") {
  configFileName = commands[1];
} else {
  configFileName = fs.readFileSync('./config.yml', 'utf8');
}


const runCommand = (cliCommand, commandFrom, commandTo, excludeItems) => {
  // These are default args
  let args = [
    "--log-level=DEBUG",
    "--drive-export-formats=docx,xlsx,pptx,svg",
    "--drive-import-formats=docx,xlsx,pptx,svg",
    "--drive-server-side-across-configs",
    "--fast-list",
    `--exclude=${excludeItems.join(" ")}`,
    "--dry-run",
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

if (!remote_from || !remote_to || !dir_from || !dir_to ) {
  const file = YAML.parse(configFileName);
  const jsonString = JSON.stringify(file);
  const obj = JSON.parse(jsonString);
  const list = obj.mapping;
  for (let item in list) {
    const source = list[item];
    for (let row in source) {
      const from = source[row].from;
      const to = source[row].to;

      remote_from = from[0];
      dir_from = from[1];

      remote_to = to[0];
      dir_to = to[1];

      let excludeItems;
      if (source[row].exclude) {
        excludeItems = source[row].exclude;
      } else {
        excludeItems = [];
      }

      const cliCommand = commands[0];

      if (cliCommand) {
        const command = runCommand(cliCommand,
                                  `${remote_from}` + ':' + `${dir_from}`,
                                  `${remote_to}` + ':' + `${dir_to}`,
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
  }
}

