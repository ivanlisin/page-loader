// @ts-check

import debug from 'debug';
import processAssetsLinks from './html.js';
import { loadIndex, downloadAssets, saveIndex } from './helpers.js';
import { makeFileNameByUrl } from './name.js';

const log = debug('page-loader');

const loadPage = async (url, outputDir) => {
  log('Start app', url, outputDir);
  const html = await loadIndex(url);

  log('Load page', html);
  const { updatedHtml, assets } = processAssetsLinks(url, html);

  log('Download assets', assets);
  await downloadAssets(url, outputDir, assets);

  log('Save page', updatedHtml);
  await saveIndex(url, outputDir, updatedHtml);

  const filename = makeFileNameByUrl(url);
  return `Page was successfully downloaded into ${filename}`;
};

export default loadPage;
