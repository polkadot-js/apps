// Copyright 2017-2020 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useState } from 'react';
import styled from 'styled-components';
import { InputAddress, Labelled } from '@polkadot/react-components';
import { Nonce } from '@polkadot/react-query';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  defaultValue?: string | null;
  isError?: boolean;
  onChange: (accountId: string | undefined | null, accountNonce: BN) => void;
}

function Account ({ className, defaultValue, isError, onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [accountId, setAccountId] = useState<string | null | undefined>(defaultValue);
  const [accountNonce, setAccountNonce] = useState(new BN(0));

  const _onChangeAccountId = (accountId: string | null): void => {
    setAccountId(accountId);
    onChange(accountId, accountNonce);
  };
  const _onChangeAccountNonce = (accountNonce: BN): void => {
    setAccountNonce(accountNonce);
    onChange(accountId, accountNonce);
  };

  return (
    <div className={`ui--row ${className}`}>
      <div className='large'>
        <InputAddress
          defaultValue={defaultValue}
          isError={isError}
          label={t('sign data from account')}
          onChange={_onChangeAccountId}
          placeholder='0x...'
          type='account'
        />
      </div>
      {accountId && (
        <Labelled
          className='small'
          label={t('with an index of')}
        >
          <Nonce
            className='ui disabled dropdown selection'
            callOnResult={_onChangeAccountNonce}
            params={accountId}
          />
        </Labelled>
      )}
    </div>
  );
}

export default styled(Account)`
  box-sizing: border-box;
  padding-left: 2em;
`;
