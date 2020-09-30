// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ImageInfo } from './types';

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { InputAddress } from '@polkadot/react-components';
import { decodeAddress, blake2AsU8a } from '@polkadot/util-crypto';

import { useTranslation } from '../../translate';
import Avatar from './Avatar';
import backgrounds from './backgrounds';
import sets from './sets';

interface Props {
  className?: string;
}

function getIndex <T> (list: T[], hash: Uint8Array, offset: number): T {
  return list[
    ((hash[offset * 2] * 256) + hash[(offset * 2) + 1]) % list.length
  ];
}

function RoboHash ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [info, setInfo] = useState<ImageInfo | null>(null);

  const _setAddress = useCallback(
    (address: string | null): void => {
      if (address) {
        try {
          const hash = blake2AsU8a(decodeAddress(address));

          setInfo({
            background: getIndex(backgrounds, hash, 0) as string,
            parts: getIndex(sets, hash, 1).map((section, index) => getIndex(section, hash, 2 + index) as string)
          });

          return;
        } catch (error) {
          // ignore, set to null below
        }
      }

      setInfo(null);
    },
    []
  );

  return (
    <div className={className}>
      <Avatar info={info} />
    </div>
  );
}

export default React.memo(styled(RoboHash)`
  .avatarSmall {
    img {
      height: 24px;
      width: 24px;
    }
  }
`);
