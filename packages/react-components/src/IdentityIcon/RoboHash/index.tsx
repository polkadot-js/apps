// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Robots lovingly delivered by Robohash.org
// https://github.com/e1ven/Robohash
//
// The "set1" artwork (and robohash backgrounds) were created by Zikri Kader. They are available under CC-BY-3.0 or CC-BY-4.0 license.
// The "set2" artwork was created by Hrvoje Novakovic. They are available under CC-BY-3.0 license.
// The "set3" artwork was created by Julian Peter Arias. They are available under CC-BY-3.0 license.
// The Cats/"set4" were created by David Revoy, used under CC-BY-4.0 https://www.peppercarrot.com/en/article391/cat-avatar-generator
// The avatars used in "set5" were created by Pablo Stanley, for https://avataaars.com/ They are "Free for personal and commercial use. 😇"

import { ImageInfo } from './types';

import BN from 'bn.js';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { hexToBn } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';

import backgrounds from './backgrounds';
import sets from './sets';

const INCREMENT = new BN(362437);

interface Props {
  className?: string;
  publicKey: string;
  size: number;
}

function getIndex <T> (list: T[], hash: BN): T {
  const index = hash.modn(list.length);

  hash.iadd(INCREMENT);

  return list[index];
}

function createInfo (value: string): ImageInfo {
  const hash = hexToBn(blake2AsHex(value));

  return {
    background: getIndex(backgrounds, hash) as string,
    parts: getIndex(sets, hash).map((section) => getIndex(section, hash) as string)
  };
}

function RoboHash ({ className, publicKey, size }: Props): React.ReactElement<Props> | null {
  const info = useMemo(
    () => createInfo(publicKey),
    [publicKey]
  );
  const style = useMemo(
    () => ({ height: `${size}px`, width: `${size}px` }),
    [size]
  );

  return (
    <div
      className={className}
      style={style}
    >
      <img src={info.background} />
      {info.parts.map((src, index) =>
        <img
          key={index}
          src={src}
        />
      )}
    </div>
  );
}

export default React.memo(styled(RoboHash)`
  border-radius: 50%;
  position: relative;
  overflow: hidden;

  img {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
`);
