// @ts-check

import debug from 'debug';
import processAssetsLinks from './html.js';
import { load, downloadAssets, save } from './helpers.js';
import { makeFileNameByUrl } from './name.js';

const log = debug('page-loader');

const loadPage = (url, outputDir) => {
  log('Start app', url, outputDir);
  return load(url)
    .then((html) => {
      log('Load page', html);
      const { updatedHtml, assets } = processAssetsLinks(url, html);

      log('Download assets', assets);
      return downloadAssets(url, outputDir, assets)
        .then(() => updatedHtml);
    })
    .then((updatedHtml) => {
      log('Save page', updatedHtml);
      return save(url, outputDir, updatedHtml);
    })
    .then(() => {
      log('Successful completion of the app');
      const filename = makeFileNameByUrl(url);
      console.log(`Page was successfully downloaded into ${filename}`);
    });
};

export default loadPage;
