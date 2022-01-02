// @ts-check

import http from 'http';
import https from 'https';
import path from 'path';
import Listr from 'listr';
import { promises as fs } from 'fs';
import { makeFileNameByUrl, makeDirNameByUrl, makeFilePathByUrl } from './name.js';

const fetch = (url) => new Promise((resolve, reject) => {
  const protocol = url.startsWith('https') ? https : http;
  protocol.get(url, (res) => {
    if (res.statusCode !== 200) {
      const { statusCode, statusMessage } = res;
      reject(new Error(`Status Code: ${statusCode} | ${statusMessage}`));
    }
    res.setEncoding('utf8');
    const buffer = [];
    res.on('data', (chunk) => buffer.push(chunk));
    res.on('end', () => resolve(buffer.join()));
  });
});

const save = (filepath, data) => fs.writeFile(filepath, data, 'utf-8');

export const loadIndex = (href) => fetch(href).then((data) => data.toString());

export const downloadAssets = (url, outputDir, assets) => {
  const hasAssets = assets.length !== 0;
  if (!hasAssets) {
    return Promise.resolve();
  }

  const dirname = makeDirNameByUrl(url);
  const dirpath = path.join(outputDir, dirname);

  const tasks = assets.map((asset) => ({
    title: makeFileNameByUrl(url, asset),
    task: () => {
      const { href } = new URL(asset, url);
      return fetch(href)
        .then((data) => {
          const filepath = makeFilePathByUrl(outputDir, url, asset);
          return save(filepath, data);
        });
    },
  }));
  const options = { concurrency: true };
  const listr = new Listr(tasks, options);

  return fs.mkdir(dirpath).then(() => listr.run());
};

export const saveIndex = (url, outputDir, html) => {
  const filepath = makeFilePathByUrl(outputDir, url);
  return save(filepath, html);
};
