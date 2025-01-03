// Copyright 2017-2025 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import React from 'react';

import Call from '@polkadot/app-preimages/Preimages/Call';
import Hash from '@polkadot/app-preimages/Preimages/Hash';
import { usePreimage } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  value: HexString;
}

function Details ({ className, value }: Props): React.ReactElement<Props> {
  const info = usePreimage(value);

  return (
    <tr className={ className }>
      <Hash value={value} />
      <Call value={info} />
    </tr>
  );
}

export default React.memo(Details);
