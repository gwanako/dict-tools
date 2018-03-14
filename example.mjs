import tools from './index.mjs';
import util from 'util';

// list
const list = [
  'abcde',
  'abc',
  'abd',
  'ab',
  'adb',
  'bb',
  'b',
  'cda',
  'cdb',
  'cdc',
];

const root = tools.list2tree(list);

// check if converting back works
const list2 = tools.tree2list(root);
console.log(util.isDeepStrictEqual(list.sort(), list2.sort()));

// add weights weights to dict-tree
const total = tools.weights(root, word => word.length == 2 || word.length == 3);
// const total = tools.weights(root);

// prapare map for counting random words
const stats = {};

// list all words - select by indices
for (let i = 0; i < total; i += 1) {
  const word = tools.select(root, i);
  stats[word] = 0;
}

// randomly select a word and update stats
for (let i = 0; i < total * 1000; i += 1) {
  const word = tools.select(root, Math.floor(Math.random() * total));
  stats[word] += 1;
}

// display stats
for (const word in stats) {
	console.log(word + ': ' + stats[word]);
}

const encoded = tools.charEncode(root);
console.log(encoded);
const decoded = tools.charDecode(encoded);
console.log(util.isDeepStrictEqual(
  tools.tree2list(root).sort(),
  tools.tree2list(decoded).sort()
));
