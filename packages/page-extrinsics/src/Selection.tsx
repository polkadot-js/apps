// Copyright 2017-2021 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';

import React, { useCallback, useState } from 'react';

import { Button, Extrinsic, InputAddress, MarkError, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BalanceFree } from '@polkadot/react-query';

import { useTranslation } from './translate';

function Selection (): React.ReactElement {
  const { t } = useTranslation();
  const { apiDefaultTxSudo } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);

  const _onExtrinsicChange = useCallback(
    (method?: SubmittableExtrinsic<'promise'>) => setExtrinsic(() => method || null),
    []
  );

  const _onExtrinsicError = useCallback(
    (error?: Error | null) => setError(error ? error.message : null),
    []
  );

  return (
    <div className='extrinsics--Selection'>
      <InputAddress
        label={t<string>('using the selected account')}
        labelExtra={
          <BalanceFree
            label={<label>{t<string>('free balance')}</label>}
            params={accountId}
          />
        }
        onChange={setAccountId}
        type='account'
      />
      <Extrinsic
        defaultValue={apiDefaultTxSudo}
        label={t<string>('submit the following extrinsic')}
        onChange={_onExtrinsicChange}
        onError={_onExtrinsicError}
      />
      {error && !extrinsic && (
        <MarkError content={error} />
      )}
      <Button.Group>
        <TxButton
          extrinsic={extrinsic}
          icon='sign-in-alt'
          isUnsigned
          label={t<string>('Submit Unsigned')}
          withSpinner
        />
        <TxButton
          accountId={accountId}
          extrinsic={extrinsic}
          icon='sign-in-alt'
          label={t<string>('Submit Transaction')}
        />
      </Button.Group>
    </div>
  );
}

export default React.memo(Selection);
