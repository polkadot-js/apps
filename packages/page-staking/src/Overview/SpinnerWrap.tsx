// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { JSXElementConstructor, ReactElement } from 'react';
import styled from 'styled-components';

import { Spinner } from '@polkadot/react-components';

interface Props {
  check: boolean
  children: ReactElement<Props, string | JSXElementConstructor<any>>
}

function SpinnerWrap ({ check, children }: Props): React.ReactElement<Props> {
  return check
    ? children
    : (<Spinner noLabel />);
}

export default React.memo(styled(SpinnerWrap)`
  margin-top: 1rem;
`);
