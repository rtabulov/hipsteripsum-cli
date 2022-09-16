#!/usr/bin/env node

// @ts-expect-error
import HipsterIpsum from 'hipsteripsum';

import { stat, writeFile, appendFile } from 'node:fs/promises';
import filesize from 'filesize';
import filesizeParser from 'filesize-parser';

const args = process.argv.slice(2);

const TARGET_SIZE = filesizeParser(args[0]);
const FILENAME = args[1];

// create or clear file

const averageParagraphSize = filesizeParser('2kb');
const errorPercent = 0.05;

const maxParagraphsToGenerate = 2 ** 8;
const wantedParagraphsToGenerate =
  (TARGET_SIZE * errorPercent) / averageParagraphSize;

const paragraphsToGenerate = Math.min(
  wantedParagraphsToGenerate,
  maxParagraphsToGenerate,
);

const main = async () => {
  await writeFile(FILENAME, '');

  let { size } = await stat(FILENAME);

  while (size < TARGET_SIZE) {
    await appendFile(
      FILENAME,
      HipsterIpsum.get(paragraphsToGenerate, false, false)
        .split('\n\n')
        .join('\n') + '\n',
    );

    size = (await stat(FILENAME)).size;
  }

  console.log(`Finished writing ${FILENAME}\nFinal size: ${filesize(size)}.`);
};

main();
