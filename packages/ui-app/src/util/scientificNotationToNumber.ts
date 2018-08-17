// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

// Convert positive number from scientific notation (i.e. scientificToDecimal('2.594e40'))
// Reference: https://gist.github.com/jiggzson/b5f489af9ad931e3d186
export default function scientificToDecimal (num: string): string {
  if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
    const zero = '0';
    const parts = String(num).toLowerCase().split('e'); // split into coeff and exponent
    let e = parts.pop(); // store the exponential part
    if (e) {
      const eNumber = Number(e);
      let l = Math.abs(Number(e)); // get the number of zeros
      const sign = eNumber / l;
      const coeffArray = parts[0].split('.');
      const dec = coeffArray[1];
      if (dec) {
        l = l - dec.length;
      }
      num = coeffArray.join('') + new Array(l + 1).join(zero);
    } else {
      throw Error('Exponential part of scientific notation is missing');
    }
  }
  return num;
}
