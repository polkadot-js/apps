// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import { AddressSummary } from '@polkadot/ui-app';

type Props = {
  accountId: string
};

const Wrapper = styled.article`
  position: relative;
  flex: 1 1;
  min-width: 19%;
  max-width: 19%;

  .ui--AddressSummary{
    justify-content: center;
  }
`;

export default class Account extends React.PureComponent<Props> {
  render () {
    const { accountId } = this.props;

    return (
      <Wrapper className='overview--Account'>
        <AddressSummary
          value={accountId}
          identIconSize={96}
          isEditable
          withAvailable
          withBonded
          withNonce={false}
          withUnlocking
        />
      </Wrapper>
    );
  }
}
