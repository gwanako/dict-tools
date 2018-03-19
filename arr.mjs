const setFlag = (bin, flag, on = true) => on ? bin | flag : bin & ~flag;

const VAL_MASK_CH     = 255;  // 0000 0000 0000 0000 0000 0000 1111 1111
const VAL_FLAG_LEFT   = 256;  // 0000 0000 0000 0000 0000 0001 0000 0000
const VAL_FLAG_RIGHT  = 512;  // 0000 0000 0000 0000 0000 0010 0000 0000
const VAL_FLAG_FINAL  = 1024; // 0000 0000 0000 0000 0000 0100 0000 0000
const VAL_OFFSET_NEXT = 12;   // 0000 0000 0000 0000 0000 xxxx xxxx xxxx

const getSymbol = bin => bin & VAL_MASK_CH;
const hasLeft   = bin => !!(bin & VAL_FLAG_LEFT);
const hasRight  = bin => !!(bin & VAL_FLAG_RIGHT);
const isFinal   = bin => !!(bin & VAL_FLAG_FINAL);
const getNext   = bin => bin >>> VAL_OFFSET_NEXT;

const setSymbol = (bin, num = 0) => bin & ~VAL_MASK_CH | num;
const setLeft   = (bin, on = true) => setFlag(bin, VAL_FLAG_LEFT, on);
const setRight  = (bin, on = true) => setFlag(bin, VAL_FLAG_RIGHT, on);
const setFinal  = (bin, on = true) => setFlag(bin, VAL_FLAG_FINAL, on);
const setNext   = (bin, num = 0) => bin | num << VAL_OFFSET_NEXT;

export function checkWord(arr, offset, map, word) {
  const lead = Array.from(word).map(char => map[char]);
  const last = lead.pop();
  let index = offset;
  for (const symbol of lead) {
    index = getNext(findSymbol(arr, index, symbol));
  }
  return isFinal(findSymbol(arr, index, last));
}

function findSymbol(arr, offset, symbol) {
  let heapOffset = 0;
  let bin = arr[offset];
  let binSymbol = getSymbol(bin);
  while (binSymbol !== symbol) {
    if (binSymbol < symbol) {
      if (!hasLeft(bin)) {
        return false;
      }
      heapOffset = heapOffset * 2 + 1;
    } else {
      if (!hasRight(bin)) {
        return false;
      }
      heapOffset = heapOffset * 2 + 2;
    }
    bin = arr[offset + heapOffset];
    binSymbol = getSymbol(bin);
  }
  return bin;
}


function charDecodeToArr(str, map) {
  const maxSize = 30 + 1; // TODO
  const arr = new Uint32Array(10000); // TODO
  const buff = [];
  let prev = null;
  let node = new Uint32Array(maxSize);
  let offset = 0;
  let level = 0;
  let highestLevel = 0;
  node[0] = 1;
  buff[0] = node;
  for (const char of str) {
  	switch (char) {
      case ';':
        prev[prev[0]] |= VAL_FLAG_FINAL;
      case ',':
        const size = node[node[0]];
        if (size > 1) {
          prev[prev[0]] |= offset << VAL_OFFSET_NEXT;
          fillArr(arr, offset, node, size);
          offset += size;
        }
        level -= 1;
        node = prev;
        prev = buff[level]; // -1 at root
        break;
    	default:
        node[node[0]] = map[char];
        node[0] += 1;
        level += 1;
        prev = node;
        if (level > highestLevel) {
          node = new Uint32Array(maxSize);
          buff[level] = node;
          highestLevel += 1;
        } else {
          node = buff[level];
        }
        node[0] = 1;
    }
  }
  offset = getNext(buff[0][1]);
  return { arr, offset };
}

function fillArr(arr, offset, node, size) {
  // TODO: heap
  for (let i = 0; i < size - 1; i += 1) {
    arr[offset + i] = node[i + 1];
  }
}
