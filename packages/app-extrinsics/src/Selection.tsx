// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Call } from '@polkadot/types/interfaces';
import { I18nProps as Props } from '@polkadot/react-components/types';

import React, { useMemo, useState } from 'react';
import { Button, Extrinsic, InputAddress } from '@polkadot/react-components';
import { useApi, useTx } from '@polkadot/react-hooks';
import { BalanceFree } from '@polkadot/react-query';

import translate from './translate';

function Selection ({ t }: Props): React.ReactElement<Props> {
  const { apiDefaultTxSudo } = useApi();
  const [method, setMethod] = useState<Call | null>(null);

  const _onChangeMethod = (method?: Call): void => {
    setMethod(method || null);
  };

  const { accountId, onChangeAccountId, sendTx, sendUnsigned } = useTx(method);

  const isValid = useMemo(
    (): boolean => !(!accountId || !method || (accountId && accountId.length === 0)),
    [accountId, method]
  );

  return (
    <div className='extrinsics--Selection'>
      <InputAddress
        label={t('using the selected account')}
        labelExtra={
          <BalanceFree
            label={
              <label>
                {t('free balance')}
              </label>
            }
            params={accountId}
          />
        }
        onChange={onChangeAccountId}
        type='account'
      />
      <Extrinsic
        defaultValue={apiDefaultTxSudo}
        label={t('submit the following extrinsic')}
        onChange={_onChangeMethod}
        onEnter={sendTx}
      />
      <Button.Group>
        <Button
          isDisabled={!method}
          label={t('Submit Unsigned')}
          icon='sign-in'
          onClick={sendUnsigned}
        />
        <Button.Or />
        <Button
          isDisabled={!isValid}
          isPrimary
          label={t('Submit Transaction')}
          icon='sign-in'
          onClick={sendTx}
        />
      </Button.Group>
    </div>
  );
}

export default translate(Selection);
