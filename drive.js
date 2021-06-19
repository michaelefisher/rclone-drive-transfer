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
const copy_from = `${from}` + ':' + `${dir}`;
const copy_to = `${to}` + '/' + `${dir}`;

//TODO: Set drive-server-side-across-configs automatically if src and dest are drive
//

const args = [
//  "--drive-server-side-across-configs",
//  "--interactive",
  "--verbose",
  "--gcs-bucket-policy-only",
]

// A little gross, admittedly
const ls = rclone.copy(
  copy_from,
  copy_to,
  ...args
);

ls.stdout.on("data", (data) => {
  console.log(data.toString());
});

ls.stderr.on("data", (data) => {
  console.error(data.toString());
});

