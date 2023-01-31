// Copyright 2017-2023 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from '../types';

import React from 'react';

import BasicAccountIdBase from './BasicAccountIdBase';

function BasicAccountId20 (props: Props): React.ReactElement<Props> {
  return (
    <BasicAccountIdBase
      {...props}
      bytesLength={20}
    />
  );
}

export default React.memo(BasicAccountId20);
