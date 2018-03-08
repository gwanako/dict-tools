export function list2tree(list) {
  const tree = {};
  for (const word of list) {
    let node = tree;
    let subnode;
    for (const char of word) {
      subnode = node[char];
      if (subnode) {
        node = subnode;
      } else {
        node = node[char] = {};
      }
    }
    node._ = true;
  }
  return tree;
};

export function tree2list(root) {
  const total = weights(root);
  const list = [];
  for (let index = 0; index < total; index += 1) {
    const word = select(root, index);
    list.push(word);
  }
  return list;
};

// module for adding weights to dict-tree
export function weights(node, predicate = () => true, word = '') {
  let total = 0;
  for (const ch in node) {
  	if (ch === '_') {
    	if (predicate(word)) {
      	total += 1;
      }
    } else if (ch !== '$') {
      total += weights(node[ch], predicate, word + ch);
    }
  }
  return node.$ = total;
}

// module for selecting word from dict-tree with weights
export function select(node, index) {
  let subnode, next;
  for (const ch in node) {
  	if (ch === '_' || ch === '$') {
    	continue;
    }
    subnode = node[ch];
    next = index - subnode.$;
    if (next < 0) {
    	return ch + select(subnode, index);
    }
    index = next;
  }
  return '';
}

export function charEncode(node) {
  let str = '';
  for (const ch in node) {
  	if (ch === '_' || ch === '$') {
    	continue;
    }
    const subnode = node[ch];
    const substr = charEncode(subnode);
    str += ch;
    if (!substr) {
      str += ';';
    } else {
      if (subnode._) {
     	  str += ',';
      }
      str += substr + '.';
    }
  }
  return str;
}

export function charDecode(str) {
  let top = {
  	node: {},
  };
  for (const ch of str) {
  	switch (ch) {
    	case ',':
      	top.node._ = true;
        break;
    	case ';':
      	top.node._ = true;
      	top = top.back;
        break;
    	case '.':
      	top = top.back;
        break;
    	default:
        top = {
        	node: top.node[ch] = {},
          back: top,
        };
    }
  }
  return top.node;
}

export default {
  list2tree,
  tree2list,
  weights,
  select,
  charEncode,
  charDecode,
};
