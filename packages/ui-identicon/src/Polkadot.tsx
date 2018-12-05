// Copyright 2018 Paritytech via paritytech/oo7/polkadot-identicon
// Copyright 2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// This has been converted from the original version that can be found at
//
// https://github.com/paritytech/oo7/blob/251ba2b7c45503b68eab4320c270b5afa9bccb60/packages/polkadot-identicon/src/index.jsx
//
// Here we have done the following to convert the component -
//   - Converted the code to TypeScript
//   - Removed the oo7 dependencies (since not initialised properly, it makes additional connections to wrong endpoints)
//   - Remove encoding functionality, these are catered for in the base
//   - Remove copy functionality (this is catered from in the base components)
//   - Move constants to file-level
//   - Overall it is now just a static component, expecting an address as an input value

import { Props as BaseProps } from './types';

import React from 'react';
import { decodeAddress } from '@polkadot/keyring';
import blake2b from '@polkadot/util-crypto/blake2/blake2b/asU8a';

type Props = BaseProps & {
  sixPoint?: boolean
};

type Scheme = {
  freq: number,
  colors: Array<number>
};

const s = 64;
const c = s / 2;
const z = s / 64 * 5;

const zero = blake2b(new Uint8Array(32));
const schema: { [index: string]: Scheme } = {
  target: { freq: 1, colors: [0, 28, 0, 0, 28, 0, 0, 28, 0, 0, 28, 0, 0, 28, 0, 0, 28, 0, 1] },
  cube: { freq: 20, colors: [0, 1, 3, 2, 4, 3, 0, 1, 3, 2, 4, 3, 0, 1, 3, 2, 4, 3, 5] },
  quazar: { freq: 16, colors: [1, 2, 3, 1, 2, 4, 5, 5, 4, 1, 2, 3, 1, 2, 4, 5, 5, 4, 0] },
  flower: { freq: 32, colors: [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 3] },
  cyclic: { freq: 32, colors: [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 6] },
  vmirror: { freq: 128, colors: [0, 1, 2, 3, 4, 5, 3, 4, 2, 0, 1, 6, 7, 8, 9, 7, 8, 6, 10] },
  hmirror: { freq: 128, colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 8, 6, 7, 5, 3, 4, 2, 11] }
};

function findScheme (d: number): Scheme {
  let cum = 0;
  const ks = Object.keys(schema);

  for (let i in ks) {
    cum += schema[ks[i]].freq;

    if (d < cum) {
      return schema[ks[i]];
    }
  }

  throw new Error('Unable to find schema');
}

export default class Identicon extends React.PureComponent<Props> {
  render () {
    const { className, sixPoint = false, size, style, value } = this.props;

    const r = sixPoint
      ? (s / 2 / 8 * 5)
      : (s / 2 / 4 * 3);
    const rroot3o2 = r * Math.sqrt(3) / 2;
    const ro2 = r / 2;
    const rroot3o4 = r * Math.sqrt(3) / 4;
    const ro4 = r / 4;
    const r3o4 = r * 3 / 4;
    const total = Object.keys(schema).map(k => schema[k].freq).reduce((a, b) => a + b);
    const id = Array.from(blake2b(decodeAddress(value))).map((x, i) =>
      (x + 256 - zero[i]) % 256
    );
    const sat = (Math.floor(id[29] * 70 / 256 + 26) % 80) + 30;
    const d = Math.floor((id[30] + id[31] * 256) % total);
    const scheme = findScheme(d);
    const palette = Array.from(id).map((x, i) => {
      const b = (x + i % 28 * 58) % 256;

      if (b === 0) {
        return '#444';
      } else if (b === 255) {
        return 'transparent';
      }

      const h = Math.floor(b % 64 * 360 / 64);
      const l = [53, 15, 35, 75][Math.floor(b / 64)];

      return `hsl(${h}, ${sat}%, ${l}%)`;
    });

    const rot = (id[28] % 6) * 3;
    const colors = scheme.colors.map((_, i) =>
      palette[scheme.colors[i < 18 ? (i + rot) % 18 : 18]]
    );

    let i = 0;

    return (
      <div
        className={`container ${className}`}
        style={style}
      >
        <svg
          id={value}
          name={value}
          width={size}
          height={size}
          viewBox='0 0 64 64'
        >
          <circle cx={s / 2} cy={s / 2} r={s / 2} fill='#eee'/>
          <circle cx={c} cy={c - r} r={z} fill={colors[i++]}/>
          <circle cx={c} cy={c - ro2} r={z} fill={colors[i++]}/>
          <circle cx={c - rroot3o4} cy={c - r3o4} r={z} fill={colors[i++]}/>
          <circle cx={c - rroot3o2} cy={c - ro2} r={z} fill={colors[i++]}/>
          <circle cx={c - rroot3o4} cy={c - ro4} r={z} fill={colors[i++]}/>
          <circle cx={c - rroot3o2} cy={c} r={z} fill={colors[i++]}/>
          <circle cx={c - rroot3o2} cy={c + ro2} r={z} fill={colors[i++]}/>
          <circle cx={c - rroot3o4} cy={c + ro4} r={z} fill={colors[i++]}/>
          <circle cx={c - rroot3o4} cy={c + r3o4} r={z} fill={colors[i++]}/>
          <circle cx={c} cy={c + r} r={z} fill={colors[i++]}/>
          <circle cx={c} cy={c + ro2} r={z} fill={colors[i++]}/>
          <circle cx={c + rroot3o4} cy={c + r3o4} r={z} fill={colors[i++]}/>
          <circle cx={c + rroot3o2} cy={c + ro2} r={z} fill={colors[i++]}/>
          <circle cx={c + rroot3o4} cy={c + ro4} r={z} fill={colors[i++]}/>
          <circle cx={c + rroot3o2} cy={c} r={z} fill={colors[i++]}/>
          <circle cx={c + rroot3o2} cy={c - ro2} r={z} fill={colors[i++]}/>
          <circle cx={c + rroot3o4} cy={c - ro4} r={z} fill={colors[i++]}/>
          <circle cx={c + rroot3o4} cy={c - r3o4} r={z} fill={colors[i++]}/>
          <circle cx={c} cy={c} r={z} fill={colors[i++]}/>
        </svg>
      </div>
    );
  }
}
