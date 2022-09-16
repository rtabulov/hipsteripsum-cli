#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-expect-error
const hipsteripsum_1 = __importDefault(require("hipsteripsum"));
const promises_1 = require("node:fs/promises");
const filesize_1 = __importDefault(require("filesize"));
const filesize_parser_1 = __importDefault(require("filesize-parser"));
const args = process.argv.slice(2);
const TARGET_SIZE = (0, filesize_parser_1.default)(args[0]);
const FILENAME = args[1];
// create or clear file
const averageParagraphSize = (0, filesize_parser_1.default)('2kb');
const errorPercent = 0.05;
const maxParagraphsToGenerate = 2 ** 8;
const wantedParagraphsToGenerate = (TARGET_SIZE * errorPercent) / averageParagraphSize;
const paragraphsToGenerate = Math.min(wantedParagraphsToGenerate, maxParagraphsToGenerate);
const main = async () => {
    await (0, promises_1.writeFile)(FILENAME, '');
    let { size } = await (0, promises_1.stat)(FILENAME);
    while (size < TARGET_SIZE) {
        await (0, promises_1.appendFile)(FILENAME, hipsteripsum_1.default.get(paragraphsToGenerate, false, false)
            .split('\n\n')
            .join('\n') + '\n');
        size = (await (0, promises_1.stat)(FILENAME)).size;
    }
    console.log(`Finished writing ${FILENAME}\nFinal size: ${(0, filesize_1.default)(size)}.`);
};
main();
