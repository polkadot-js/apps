// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Bubble, InputAddress } from '@polkadot/react-components';
import { AccountIndex, Balance, Nonce } from '@polkadot/react-query';

interface Props {
  className?: string;
  onChange: (accountId: string | null) => void;
}

function AccountSelector ({ className, onChange }: Props): React.ReactElement<Props> {
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect((): void => onChange(accountId), [accountId]);

  return (
    <section className={`template--AccountSelector ui--row ${className}`}>
      <InputAddress
        className='medium'
        label='my default account'
        onChange={setAccountId}
        type='account'
      />
      <div className='medium'>
        <Bubble color='teal' icon='address card' label='index'>
          <AccountIndex params={accountId} />
        </Bubble>
        <Bubble color='yellow' icon='adjust' label='balance'>
          <Balance params={accountId} />
        </Bubble>
        <Bubble color='yellow' icon='target' label='transactions'>
          <Nonce params={accountId} />
        </Bubble>
      </div>
    </section>
  );
}

export default styled(AccountSelector)`
  align-items: flex-end;

  .summary {
    text-align: center;
  }
`;
