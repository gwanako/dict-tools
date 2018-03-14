export function check(arr, word) {
  // TODO make map ch => num
  // TODO change word into array of nums + last num
  // the map could probably be extraced from arr
  let index = 0;
  let node = 0;
  for (const ch of word.substr(0, -1)) {
    node = find_ch_node(arr, index, ch);
    if (!has_next(node)) {
      return false;
    }
    index = get_next(node);
  }
  node = find_ch_node(arr, index, word[word.length - 1]);
  return is_final(node);
}

function find_ch_node(arr, index, ch) {
  let node = arr[index];
  let node_ch = get_ch(node);
  let index_ch = 0;
  while (node_ch !== ch) {
    if (node_ch < ch) {
      if (!has_left(node)) {
        return false;
      }
      index_ch = index_ch * 2 + 1;
    } else {
      if (!has_right(node)) {
        return false;
      }
      index_ch = index_ch * 2 + 2;
    }
    node = arr[index + index_ch];
    node_ch = get_ch(node);
  }
  return node;
}

function get_ch(node) {
  return node & 255; // 0000 0000 0000 0000 0000 0000 1111 1111
}
function has_left(node) {
  return node & 256; // 0000 0000 0000 0000 0000 0001 0000 0000
}
function has_right(node) {
  return node & 512; // 0000 0000 0000 0000 0000 0010 0000 0000
}
function is_final(node) {
  return node & 1024; // 0000 0000 0000 0000 0000 0100 0000 0000
}
function has_next(node) {
  return node & 2048; // 0000 0000 0000 0000 0000 1000 0000 0000
}
function get_next(node) {
  return node >>> 12; // 0000 0000 0000 0000 0000 xxxx xxxx xxxx
}

function wordToEnums(word) {

}
