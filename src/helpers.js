// @ts-check

import path from 'path';
import Listr from 'listr';
import { promises as fs } from 'fs';
import { fetch } from './lib.js';
import { makeFileNameByUrl, makeDirNameByUrl, makeFilePathByUrl } from './name.js';

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
          return fs.writeFile(filepath, data, 'utf-8');
        });
    },
  }));
  const options = { concurrency: true };
  const listr = new Listr(tasks, options);

  return fs.mkdir(dirpath).then(() => listr.run());
};

export const saveIndex = (url, outputDir, html) => {
  const filepath = makeFilePathByUrl(outputDir, url);
  return fs.writeFile(filepath, html, 'utf-8');
};
