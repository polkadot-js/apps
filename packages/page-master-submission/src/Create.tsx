// Copyright 2017-2020 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';

import React, { useCallback, useState, useEffect } from 'react';
import { hexToU8a, isFunction, isHex, stringToHex, stringToU8a, u8aToHex } from '@polkadot/util';
import { Button, Extrinsic, InputAddress } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BalanceFree } from '@polkadot/react-query';

import { useTranslation } from './translate';

function Create (): React.ReactElement {
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

  useEffect(() => {
    console.log('extrinsic', extrinsic)
    if (extrinsic) {
      const jprop = extrinsic.method.toJSON();

      // Bug in polkadot-js makes hex-encoded call index unparsable so we convert to an array.
      jprop.callIndex = [...hexToU8a(jprop.callIndex)];
      console.log(JSON.stringify(jprop));
    }
  }, [extrinsic]);

  return (
    <div className='extrinsics--Create'>
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
      {error && (
        <article className='error'>{error}</article>
      )}
    </div>
  );
}

export default React.memo(Create);
