const https = require('https');
const unzip = require('unzip');
const fs = require('fs');

const httpGet = async (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        response.resume();
        return reject(response);
      }
      resolve(response);
    }).on('error', reject );
  });
};

const getBody = async (url) => {
  return httpGet(url).then(response => new Promise((resolve) => {
    response.setEncoding('utf8');
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => { resolve(data); });
  }));
};

const findInBody = async (url, pattern) => {
  return getBody(url).then((body) => {
    const match = body.match(pattern);
    if (match) {
      return match[0];
    } else {
      return Promise.reject('no match');
    }
  });
};

const extractFromZip = async (url, filename) => {
  return httpGet(url).then(response => new Promise((resolve, reject) => {
    const unzipping = response.pipe(unzip.Parse());
    unzipping.on('entry', (entry) => {
      if (entry.path === filename) {
        resolve(entry);
      } else {
        entry.autodrain();
      }
    });
    unzipping.on('close', () => {
      reject('not found');
    });
    unzipping.on('error', reject);
  }));
};

(async () => {
  const page = 'https://sjp.pl/slownik/growy/';
  console.log(`Looking for recent dictionary archive at ${page}...`);
  const filename = await findInBody(page, /sjp\-\d+\.zip/);
  const url = page + filename;
  console.log(`Opening ${url}...`);
  const stream = await extractFromZip(url, 'slowa.txt');
  const path = 'tmp/dict.txt';
  console.log(`Extracting and saving dictionary file to ${path}...`);
  stream.pipe(fs.createWriteStream(path));
  stream.on('end', () => { console.log('Done!'); })
})();

// const lines = [];
// readline.createInterface({
//   input: entry,
//   crlfDelay: Infinity,
// }).on('line', (line) => {
//   lines.push(line);
// }).on('close', () => {
//   console.log(lines.slice(0, 5));
// });
