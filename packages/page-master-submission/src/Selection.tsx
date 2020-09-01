// Copyright 2017-2020 @polkadot/app-master-submission authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';

import React, { useCallback, useState } from 'react';
import { Button, Extrinsic, InputAddress, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BalanceFree } from '@polkadot/react-query';
import { hexToU8a } from '@polkadot/util';

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

  console.log('extrinsic', extrinsic)
  if (extrinsic) {
    const jprop = extrinsic.method.toJSON();

    // Bug in polkadot-js makes hex-encoded call index unparsable so we convert to an array.
    jprop.callIndex = [...hexToU8a(jprop.callIndex)];
    console.log(JSON.stringify(jprop));
  }

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
        label={t<string>('submit the following master proposal')}
        onChange={_onExtrinsicChange}
        onError={_onExtrinsicError}
      />
      {error && (
        <article className='error'>{error}</article>
      )}
      <Button.Group>
        <TxButton
          extrinsic={extrinsic}
          icon='sign-in-alt'
          isBasic
          isDisabled={!extrinsic}
          isUnsigned
          label={t<string>('Submit Unsigned')}
          withSpinner
        />
        <TxButton
          accountId={accountId}
          extrinsic={extrinsic}
          icon='sign-in-alt'
          isDisabled={!extrinsic || !accountId}
          isPrimary={false}
          label={t<string>('Submit Transaction')}
        />
      </Button.Group>
    </div>
  );
}

export default React.memo(Selection);
