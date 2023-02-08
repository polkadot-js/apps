// Copyright 2017-2022 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { RawParam } from '@polkadot/react-params/types';
import type { DecodedExtrinsic } from './types';

import React, { useCallback, useState, useEffect } from 'react';

import { Button, Extrinsic, InputAddress, MarkError, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BalanceFree } from '@polkadot/react-query';
import { useParams } from 'react-router-dom';
import type { HexString } from '@polkadot/util/types';
import type { ApiPromise } from '@polkadot/api';

import Decoded from './Decoded';
import { useTranslation } from './translate';
import { Call as CallDisplay, Input, InputExtrinsic } from '@polkadot/react-components';
import type { Call } from '@polkadot/types/interfaces';
import { assert, isHex, stringToHex } from '@polkadot/util';

interface Props {
  className?: string;
  defaultValue?: DecodedExtrinsic | null;
  setLast?: (value: DecodedExtrinsic | null) => void;
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

function getDecodedExtr (api:ApiPromise, encodedVal: string, defaultValue: DecodedExtrinsic | null): DecodedExtrinsic|null {
  try {
    if(encodedVal == undefined && defaultValue){
      return defaultValue;
    }
    let extrinsicCall: Call;
    let hex = encodedVal;
    let decoded: SubmittableExtrinsic<'promise'> | null = null;
    assert(isHex(hex), 'Expected a hex-encoded call');

    try {
      decoded = api.tx(hex);
      extrinsicCall = api.createType('Call', decoded.method);
    } catch (e) {
      extrinsicCall = api.createType('Call', hex);
    }
    const { method, section } = api.registry.findMetaCall(extrinsicCall.callIndex);
    const extrinsicFn = api.tx[section][method];

    return { call: extrinsicCall, fn: extrinsicFn, hex};
  } catch (e) {
    return null;
  }
}

function Selection ({ className, defaultValue }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { encoded } = useParams<{ encoded: string }>();
  const [initialValue] = useState<DecodedExtrinsic | null>(()=>getDecodedExtr(api, encoded, defaultValue));
  const defaultSection = Object.keys(api.tx)[0];
  const defaultMethod = Object.keys(api.tx[defaultSection])[0];
  const apiDefaultTx = api.tx[defaultSection][defaultMethod];
  const apiDefaultTxSudoSupersig = (api.tx.supersig && api.tx.supersig.submitCall) || apiDefaultTx;
  
  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [defaultExtr] = useState<DefaultExtrinsic>(() => extractDefaults(initialValue, apiDefaultTxSudoSupersig));

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
        defaultArgs={defaultExtr.defaultArgs}
        defaultValue={defaultExtr.defaultFn}
        label={t<string>('submit the following extrinsic')}
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
