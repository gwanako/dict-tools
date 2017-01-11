const bwtc = require('./bwtc.js');
const fs = require('fs');

const list2tree = (list) => {
    var i, count, word, letter, pos, len, tree, node, nnode;
    count = list.length;
    tree = {};
    for (i = 0; i < count; i += 1) {
        word = list[i];
        len = word.length;
        node = tree;
        for (pos = 0; pos < len; pos += 1) {
            letter = word[pos];
            nnode = node[letter];
            if (nnode) {
                node = nnode;
            } else {
                node = node[letter] = {};
            }
        }
        node._ = true;
    }
    return tree;
};

const tree2str = (node) => {
  let str = '';
  for (const ch in node) {
    if (ch !== '_') {
      str += ch;
      const sub = node[ch];
      const substr = tree2str(sub);
      if (substr) {
        if (sub._) {
          str += '(';
        }
        str += '(' + substr + ')'
      }
    }
  }
  return str;
};

const str2uint8 = (chars, str) => {
  // const ws = /\s/;
  const arr = new Uint8Array(str.length);
  let letter = 0;
  let pos = 0;
  for (const ch of str) {
    // if (ws.test(ch)) {
    //   continue;
    // }
    arr[pos++] = chars[ch] || (chars[ch] = ++letter);
  }
  return arr;
};

fs.readFile('dict.json', 'utf8', function (err, str) {
  str = tree2str(list2tree(JSON.parse(str)));
  const chars = {};
  const arr = str2uint8(chars, str);
  fs.writeFile('chars.txt', Object.keys(chars).join(''), function (err) {
    if (err) throw err;
  });
  var data = Buffer.from(bwtc.enc(arr));
  fs.writeFile('compressed.data', data, function (err) {
    if (err) throw err;
  });
});
