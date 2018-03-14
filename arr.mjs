export function check(arr, offset, ch_map, word) {
  const { head, last_ch } = map_word(ch_map, word);
  let value;
  for (const ch of head) {
    value = find_ch(arr, offset, ch);
    // if (!has_next(value)) {
    //   return false;
    // }
    offset = get_next(value);
  }
  value = find_ch(arr, offset, last_ch);
  return is_final(value);
}

function find_ch(arr, offset, ch) {
  let value = arr[offset];
  let value_ch = get_ch(value);
  let offset_ch = 0;
  while (value_ch !== ch) {
    if (value_ch < ch) {
      if (!has_left(value)) {
        return false;
      }
      offset_ch = offset_ch * 2 + 1;
    } else {
      if (!has_right(value)) {
        return false;
      }
      offset_ch = offset_ch * 2 + 2;
    }
    value = arr[offset + offset_ch];
    value_ch = get_ch(value);
  }
  return value;
}

function get_ch(value) {
  return value & 255; // 0000 0000 0000 0000 0000 0000 1111 1111
}

function has_left(value) {
  return value & 256; // 0000 0000 0000 0000 0000 0001 0000 0000
}

function has_right(value) {
  return value & 512; // 0000 0000 0000 0000 0000 0010 0000 0000
}

function is_final(value) {
  return value & 1024; // 0000 0000 0000 0000 0000 0100 0000 0000
}

// function has_next(value) {
//   return value & 2048; // 0000 0000 0000 0000 0000 1000 0000 0000
// }

function get_next(value) {
  return value >>> 12; // 0000 0000 0000 0000 0000 xxxx xxxx xxxx
}

function map_word(ch_map, word) {
  const last_index = word.length - 1;
  const head = [];
  for (let i = 0; i < last_index; i += 1) {
    head.push(ch_map[word[i]]);
  }
  const last_ch = ch_map[word[last_index]];
  return { head, last_ch };
}
