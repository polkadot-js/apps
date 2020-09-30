// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ImageInfo } from './types';

import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  info?: ImageInfo | null;
}

function Avatar ({ className, info }: Props): React.ReactElement<Props> | null {
  if (!info) {
    return null;
  }

  return (
    <div className={className}>
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

export default React.memo(styled(Avatar)`
  position: relative;

  img {
    border-radius: 50%;
    height: 256px;
    left: 0;
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 256px;
  }
`);
