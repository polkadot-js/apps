// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from '../types.js';

import React from 'react';

import BasicAccountIdBase from './BasicAccountIdBase.js';

function BasicAccountId32 (props: Props): React.ReactElement<Props> {
  return (
    <BasicAccountIdBase
      {...props}
      bytesLength={32}
    />
  );
}

export default React.memo(BasicAccountId32);
