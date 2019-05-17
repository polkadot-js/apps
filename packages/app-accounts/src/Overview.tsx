// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps } from './types';
import React from 'react';
import styled from 'styled-components';
import keyring from '@polkadot/ui-keyring';

import Account from './Account';

type Props = ComponentProps;

const Wrapper = styled.div`
  .accounts {
    display: flex;
    flex-wrap: wrap;

    .spacer {
      flex: 1 1;
      margin: .25rem;
      padding: 1rem 1.5rem;
    }
  }
`;

class Overview extends React.PureComponent<Props> {

  constructor (props: Props) {
    super(props);
  }

  render () {
    const accounts = keyring.getAccounts();

    return (
      <Wrapper>
        <div className='accounts'>
          {accounts.map((account) => {
            const address = account.address();

            return (
              <Account
                accountId={address}
                key={address}
              />
            );
          })}
          <div className='spacer' />
        </div>
      </Wrapper>
    );
  }
}

export default Overview;
