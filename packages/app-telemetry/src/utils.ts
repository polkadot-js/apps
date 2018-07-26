export interface Viewport {
  width: number;
  height: number;
}

export function viewport (): Viewport {
  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  return { width, height };
}

export function formatNumber (num: number): string {
  const input = num.toString();

  let output = '';
  let length = input.length;

  while (length > 3) {
    output = ',' + input.substr(length - 3, 3) + output;
    length -= 3;
  }

  output = input.substr(0, length) + output;

  return output;
}

export function trimHash (hash: string, length: number): string {
  if (hash.length < length) {
    return hash;
  }

  const side = ((length - 2) / 2) | 0;

  return hash.substr(0, side) + '..' + hash.substr(-side, side);
}

export function milliOrSecond(num: number): string {
  if (num < 10000) {
    return `${num}ms`;
  }

  return `${(num / 1000) | 0}s`;
}

export function secondsWithPrecision (num: number): string {
  const intString = (num | 0).toString();
  const intDigits = intString.length;

  switch (intDigits) {
    case 1: return num.toFixed(3) + 's';
    case 2: return num.toFixed(2) + 's';
    case 3: return num.toFixed(1) + 's';
    default: return intString + 's';
  }
}
