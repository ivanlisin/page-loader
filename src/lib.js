import https from 'https';
import http from 'http';

// eslint-disable-next-line import/prefer-default-export
export const fetch = (url) => new Promise((resolve, reject) => {
  const protocol = url.startsWith('https') ? https : http;
  protocol.get(url, (res) => {
    if (res.statusCode !== 200) {
      const { statusCode, statusMessage } = res;
      reject(new Error(`Status Code: ${statusCode} | ${statusMessage}`));
    }
    res.setEncoding('utf-8');
    const buffer = [];
    res.on('data', (chunk) => buffer.push(chunk));
    res.on('end', () => resolve(buffer.join()));
  });
});
