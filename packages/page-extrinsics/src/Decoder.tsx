// Copyright 2017-2025 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { Call, ExtrinsicPayload } from '@polkadot/types/interfaces';
import type { HexString } from '@polkadot/util/types';
import type { DecodedExtrinsic } from './types.js';

import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Input, InputExtrinsic, MarkError, styled } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { Call as CallDisplay } from '@polkadot/react-params';
import { assert, compactToU8a, isHex, u8aConcat, u8aEq } from '@polkadot/util';

import Decoded from './Decoded.js';
import { useTranslation } from './translate.js';

interface Props {
  className?: string;
  defaultValue?: HexString | null;
  setLast: (value: DecodedExtrinsic | null) => void;
}

interface ExtrinsicInfo {
  decoded: SubmittableExtrinsic<'promise'> | null;
  extrinsicCall: Call | null;
  extrinsicError: string | null;
  extrinsicFn: SubmittableExtrinsicFunction<'promise'> | null;
  extrinsicHex: string | null;
  extrinsicKey: string;
  extrinsicPayload: ExtrinsicPayload | null;
  isCall: boolean;
}

const DEFAULT_INFO: ExtrinsicInfo = {
  decoded: null,
  extrinsicCall: null,
  extrinsicError: null,
  extrinsicFn: null,
  extrinsicHex: null,
  extrinsicKey: 'none',
  extrinsicPayload: null,
  isCall: true
};

function Decoder ({ className, defaultValue, setLast }: Props): React.ReactElement<Props> {
  const { encoded } = useParams<{ encoded: string }>();
  const [initialValue] = useState(() => defaultValue || encoded);
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ decoded, extrinsicCall, extrinsicError, extrinsicFn, extrinsicKey, extrinsicPayload, isCall }, setExtrinsicInfo] = useState<ExtrinsicInfo>(DEFAULT_INFO);

  const _setExtrinsicHex = useCallback(
    (hex: string): void => {
      try {
        assert(isHex(hex), 'Expected a hex-encoded call');

        let extrinsicCall: Call;
        let extrinsicPayload: ExtrinsicPayload | null = null;
        let decoded: SubmittableExtrinsic<'promise'> | null = null;
        let isCall = false;

        try {
          // cater for an extrinsic input
          const tx = api.tx(hex);

          // ensure that the full data matches here
          assert(tx.toHex() === hex, 'Cannot decode data as extrinsic, length mismatch');

          decoded = tx;
          extrinsicCall = api.createType('Call', decoded.method);
        } catch {
          try {
            // attempt to decode as Call
            extrinsicCall = api.createType('Call', hex);

            const callHex = extrinsicCall.toHex();

            if (callHex === hex) {
              // all good, we have a call
              isCall = true;
            } else if (hex.startsWith(callHex)) {
              // this could be an un-prefixed payload...
              const prefixed = u8aConcat(compactToU8a(extrinsicCall.encodedLength), hex);

              extrinsicPayload = api.createType('ExtrinsicPayload', prefixed);

              assert(u8aEq(extrinsicPayload.toU8a(), prefixed), 'Unable to decode data as un-prefixed ExtrinsicPayload');

              extrinsicCall = api.createType('Call', extrinsicPayload.method.toHex());
            } else {
              throw new Error('Unable to decode data as Call, length mismatch in supplied data');
            }
          } catch {
            // final attempt, we try this as-is as a (prefixed) payload
            extrinsicPayload = api.createType('ExtrinsicPayload', hex);

            assert(extrinsicPayload.toHex() === hex, 'Unable to decode input data as Call, Extrinsic or ExtrinsicPayload');

            extrinsicCall = api.createType('Call', extrinsicPayload.method.toHex());
          }
        }

        const { method, section } = api.registry.findMetaCall(extrinsicCall.callIndex);
        const extrinsicFn = api.tx[section][method];
        const extrinsicKey = extrinsicCall.callIndex.toString();

        if (!decoded) {
          decoded = extrinsicFn(...extrinsicCall.args);
        }

        setExtrinsicInfo({ ...DEFAULT_INFO, decoded, extrinsicCall, extrinsicFn, extrinsicHex: hex, extrinsicKey, extrinsicPayload, isCall });
        setLast({ call: extrinsicCall, fn: extrinsicFn, hex });
      } catch (e) {
        setExtrinsicInfo({ ...DEFAULT_INFO, extrinsicError: (e as Error).message });
        setLast(null);
      }
    },
    [api, setLast]
  );

  return (
    <StyledDiv className={className}>
      <Input
        defaultValue={initialValue}
        isError={!extrinsicFn}
        label={t('hex-encoded call')}
        onChange={_setExtrinsicHex}
        placeholder={t('0x...')}
      />
      {extrinsicError && (
        <MarkError content={extrinsicError} />
      )}
      {extrinsicFn && extrinsicCall && (
        <>
          <InputExtrinsic
            defaultValue={extrinsicFn}
            isDisabled
            key={`extrinsicKey:${extrinsicKey}`}
            label={t('decoded call')}
          />
          <CallDisplay
            className='details'
            value={extrinsicCall}
          />
        </>
      )}
      <Decoded
        extrinsic={decoded}
        isCall={isCall}
        payload={extrinsicPayload}
        withData={false}
      />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .ui--Call--toplevel {
    margin-top: 0;
  }

  .ui--Call > .ui--Params.withBorder {
    padding-left: 2rem;
  }
`;

export default React.memo(Decoder);
