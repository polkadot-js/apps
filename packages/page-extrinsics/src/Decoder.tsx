// Copyright 2017-2022 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import { useLocation } from 'react-router-dom';
import type { Call } from '@polkadot/types/interfaces';
import type { DecodedExtrinsic } from './types';

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { Button, Call as CallDisplay, Input, InputAddress, InputExtrinsic, MarkError, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BalanceFree } from '@polkadot/react-query';
import { assert, isHex } from '@polkadot/util';

import Decoded from './Decoded';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  setLast: (value: DecodedExtrinsic | null) => void;
  calldata?: string;
}

interface ExtrinsicInfo {
  decoded: SubmittableExtrinsic<'promise'> | null;
  extrinsic: SubmittableExtrinsic<'promise'> | null;
  extrinsicCall: Call | null;
  extrinsicError: string | null;
  extrinsicFn: SubmittableExtrinsicFunction<'promise'> | null;
  extrinsicHex: string | null;
}

const DEFAULT_INFO: ExtrinsicInfo = {
  decoded: null,
  extrinsic: null,
  extrinsicCall: null,
  extrinsicError: null,
  extrinsicFn: null,
  extrinsicHex: null
};

function Decoder({ className, setLast }: Props): React.ReactElement<Props> {
  const location = useLocation();
  const calldata = location?.search?.replace('?calldata=', '');
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ decoded, extrinsic, extrinsicCall, extrinsicError, extrinsicFn }, setExtrinsicInfo] = useState<ExtrinsicInfo>(DEFAULT_INFO);
  const [accountId, setAccountId] = useState<string | null>(null);

  const _setExtrinsicHex = useCallback(
    (extrinsicHex: string): void => {
      try {
        console.log('got here' + extrinsicHex);
        assert(isHex(extrinsicHex), 'Expected a hex-encoded call');

        let extrinsicCall: Call;
        let decoded: SubmittableExtrinsic<'promise'> | null = null;

        try {
          // cater for an extrinsic input...
          decoded = api.tx(extrinsicHex);
          extrinsicCall = api.createType('Call', decoded.method);
        } catch (e) {
          extrinsicCall = api.createType('Call', extrinsicHex);
        }

        const { method, section } = api.registry.findMetaCall(extrinsicCall.callIndex);
        const extrinsicFn = api.tx[section][method];
        const extrinsic = extrinsicFn(...extrinsicCall.args);

        if (!decoded) {
          decoded = extrinsic;
        }

        setExtrinsicInfo({ ...DEFAULT_INFO, decoded, extrinsic, extrinsicCall, extrinsicFn, extrinsicHex });
        setLast({ call: extrinsicCall, fn: extrinsicFn });
      } catch (e) {
        setExtrinsicInfo({ ...DEFAULT_INFO, extrinsicError: (e as Error).message });
        setLast(null);
      }
    },
    [api, setLast]
  );

  if (calldata && decoded === null) {   
    // Seems the function needs forcing to run. might be a way to touch the input to trigger the onChange?
    _setExtrinsicHex(calldata);
  }

  return (
    <div className={className}>
      <Input
        isError={!extrinsicFn}
        label={t<string>('hex-encoded call')}
        onChange={_setExtrinsicHex}
        placeholder={t<string>('0x...')}
        defaultValue={calldata}
      />
      {extrinsicError && (
        <MarkError content={extrinsicError} />
      )}
      {extrinsicFn && extrinsicCall && (
        <>
          <InputExtrinsic
            defaultValue={extrinsicFn}
            isDisabled
            label={t<string>('decoded call')}
          />
          <CallDisplay
            className='details'
            value={extrinsicCall}
          />
        </>
      )}
      <Decoded
        extrinsic={decoded}
        withData={false}
      />
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

export default React.memo(styled(Decoder)`
  .ui--Extrinsic--toplevel {
    margin-top: 0;
  }
`);
