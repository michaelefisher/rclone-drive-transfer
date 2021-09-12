#! /usr/bin/env node

import yaml from 'js-yaml';
import csvtoyaml from 'csvtoyaml';
import fs from 'fs';

const help = "Usage:\n\n./csv-to-yaml.js inputFile outputFile [...options]\n\n";

const commands = process.argv.slice(2);
const inputFile = commands && commands[0];
const outputFile = commands && commands[1];
if (commands && commands.length < 2) {
  console.error(help);
  process.exit(1);
}

csvtoyaml(inputFile)
.then((data) => {
  if (data) {
    let fileContents = yaml.load(data);
    // This is a hack to deal with the fact that the csvtoyaml library
    // doesn't deal with lists inside of values
    fileContents.forEach((node) => {
      if (node['exclude'] != '') {
        //exclude is a list delimited by commas
        const excludeItems = node['exclude'].split(',');
        node['exclude'] = excludeItems;
      }
    });
    if (fileContents) {
      fileContents = {
        'mapping':
        fileContents
      }
      fs.writeFile(outputFile, yaml.dump(fileContents, {
        'noArrayIndent':true,
        'quotingType': "\"",
        'condenseFlow': true,
      }), (error) => {
        if (error) {
          console.error(error);
          return;
        }
      });
    }
  }
})
.catch(e => {
  console.error(e);
});
