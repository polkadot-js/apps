// Copyright 2017-2025 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { RawParam } from '@polkadot/react-params/types';
import type { DecodedExtrinsic } from './types.js';

import React, { useCallback, useState } from 'react';

import { Button, InputAddress, MarkError, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { Extrinsic } from '@polkadot/react-params';
import { BalanceFree } from '@polkadot/react-query';

import Decoded from './Decoded.js';
import { useTranslation } from './translate.js';

interface Props {
  className?: string;
  defaultValue: DecodedExtrinsic | null;
}

interface DefaultExtrinsic {
  defaultArgs?: RawParam[];
  defaultFn: SubmittableExtrinsicFunction<'promise'>;
}

function extractDefaults (value: DecodedExtrinsic | null, defaultFn: SubmittableExtrinsicFunction<'promise'>): DefaultExtrinsic {
  if (!value) {
    return { defaultFn };
  }

  return {
    defaultArgs: value.call.args.map((value) => ({
      isValid: true,
      value
    })),
    defaultFn: value.fn
  };
}

function Selection ({ className, defaultValue }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { apiDefaultTxSudo } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [{ defaultArgs, defaultFn }] = useState<DefaultExtrinsic>(() => extractDefaults(defaultValue, apiDefaultTxSudo));

  const _onExtrinsicChange = useCallback(
    (method?: SubmittableExtrinsic<'promise'>) =>
      setExtrinsic(() => method || null),
    []
  );

  const _onExtrinsicError = useCallback(
    (error?: Error | null) =>
      setError(error ? error.message : null),
    []
  );

  return (
    <div className={className}>
      <InputAddress
        label={t('using the selected account')}
        labelExtra={
          <BalanceFree
            label={<label>{t('free balance')}</label>}
            params={accountId}
          />
        }
        onChange={setAccountId}
        type='account'
      />
      <Extrinsic
        defaultArgs={defaultArgs}
        defaultValue={defaultFn}
        label={t('submit the following extrinsic')}
        onChange={_onExtrinsicChange}
        onError={_onExtrinsicError}
      />
      <Decoded
        extrinsic={extrinsic}
        isCall
      />
      {error && !extrinsic && (
        <MarkError content={error} />
      )}
      <Button.Group>
        <TxButton
          extrinsic={extrinsic}
          icon='sign-in-alt'
          isUnsigned
          label={t('Submit Unsigned')}
          withSpinner
        />
        <TxButton
          accountId={accountId}
          extrinsic={extrinsic}
          icon='sign-in-alt'
          label={t('Submit Transaction')}
        />
      </Button.Group>
    </div>
  );
}

export default React.memo(Selection);
