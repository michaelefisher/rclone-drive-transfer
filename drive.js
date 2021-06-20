#! /usr/bin/env node

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

const from = process.env.REMOTE_FROM;
const to = process.env.REMOTE_TO;

// This will need to come from a config file,
// likely in yml or json, but for now, envars it is
const dir = process.env.DIR;

// Remote is in remote:dir format
// TODO: This is just in Google Drive format
const command_from = `${from}` + ':' + `${dir}`;
// TODO: This is just in GCP format
const command_to = `${to}` + '/' + `${dir}`;

// TODO: Set drive-server-side-across-configs automatically
// if src and dest are drive
const commands = process.argv.slice(2);
if (!commands.includes('sync') && !commands.includes('copy')) {
  console.error('Right now, command must be sync or copy');
  process.exit(1);
}

// TODO: This should all read from the CLI args
// and take their own flags
const args = [
//  "--drive-server-side-across-configs",
//  "--interactive",
  "--dry-run",
  "--verbose",
  "--gcs-bucket-policy-only",
  "--fast-list",
  "--interactive",
]

// Command is either () || null
let command = null;
if (commands[0] == "sync") {
  command = rclone.sync(
    command_from,
    command_to,
    ...args
  );
} else if (commands[0] == "copy") {
  command = rclone.copy(
    command_from,
    command_to,
    ...args
  );
}

if (command) {
  command.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  command.stderr.on("data", (data) => {
    console.error(data.toString());
  });
}

