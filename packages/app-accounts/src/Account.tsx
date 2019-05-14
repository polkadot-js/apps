// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressSummary } from '@polkadot/ui-app';
import React from 'react';

import styled from 'styled-components';

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

class Account extends React.PureComponent<Props> {

  render () {
    const { accountId } = this.props;

    return (
      <Wrapper className='overview--Account'>
        <AddressSummary
          value={accountId}
          identIconSize={96}
          withAvailable
          withBonded
          withIndex={false}
          withNonce={false}
          withUnlocking
        />
      </Wrapper>
    );
  }
}

export default Account;
