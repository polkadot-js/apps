// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Call } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { QueueTxExtrinsicAdd } from '@polkadot/react-components/Status/types';
import { ApiProps } from '@polkadot/react-api/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import React, { useMemo, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { Button, Extrinsic, InputAddress } from '@polkadot/react-components';
import { useApi, useTx } from '@polkadot/react-hooks';
import { BalanceFree } from '@polkadot/react-query';

import translate from './translate';

interface Props extends ApiProps, I18nProps {
  queueExtrinsic: QueueTxExtrinsicAdd;
}

function getExtrinsic (api: ApiPromise, method: Call | null): SubmittableExtrinsic | null {
  if (!method) {
    return null;
  }

  const fn = api.findCall(method.callIndex);

  return api.tx[fn.section][fn.method](...method.args);
}

function Selection (props: Props): React.ReactElement<Props> {
  const { t } = props;

  const { api, apiDefaultTxSudo } = useApi();
  const [method, setMethod] = useState<Call | null>(null);

  const _onChangeMethod = (method?: Call): void => {
    setMethod(method || null);
  }

  const { accountId, onChangeAccountId, sendTx, sendUnsigned } = useTx(getExtrinsic(api, method));

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