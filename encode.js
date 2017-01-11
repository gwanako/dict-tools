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

fs.readFile('dict.json', 'utf8', function (err, str) {
  fs.writeFile(
    'compressed.data',
    Buffer.from(bwtc.enc(Buffer.from(tree2str(list2tree(JSON.parse(str))), 'utf8'))),
    function (err) {
      if (err) throw err;
    }
  );
});
