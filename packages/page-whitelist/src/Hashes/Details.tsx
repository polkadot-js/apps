// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import React from 'react';

import Call from '@polkadot/app-preimages/Preimages/Call';
import Hash from '@polkadot/app-preimages/Preimages/Hash';
import usePreimage from '@polkadot/app-preimages/usePreimage';

interface Props {
  className?: string;
  isLatest: boolean;
  value: HexString;
}

function Details ({ className, isLatest, value }: Props): React.ReactElement<Props> {
  const info = usePreimage(isLatest, value);

  return (
    <tr className={ className }>
      <Hash value={value} />
      <Call value={info} />
    </tr>
  );
}

export default React.memo(Details);
