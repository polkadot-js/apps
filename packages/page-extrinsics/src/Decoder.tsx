// Copyright 2017-2021 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { Call } from '@polkadot/types/interfaces';

import React, { useCallback, useState } from 'react';

import { Call as CallDisplay, Input, InputExtrinsic, MarkError, Output } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { assert, isHex } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  className?: string;
}

interface ExtrinsicInfo {
  extrinsicCall: Call | null;
  extrinsicError: string | null;
  extrinsicFn: SubmittableExtrinsicFunction<'promise'> | null;
  extrinsicHash: string | null;
  extrinsicHex: string | null;
}

const DEFAULT_INFO: ExtrinsicInfo = {
  extrinsicCall: null,
  extrinsicError: null,
  extrinsicFn: null,
  extrinsicHash: null,
  extrinsicHex: null
};

function Decoder ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ extrinsicCall, extrinsicError, extrinsicFn, extrinsicHash }, setExtrinsicInfo] = useState<ExtrinsicInfo>(DEFAULT_INFO);

  const _setExtrinsicHex = useCallback(
    (extrinsicHex: string): void => {
      try {
        assert(isHex(extrinsicHex), 'Expected a hex-encoded call');

        let extrinsicCall: Call;

        try {
          // cater for an extrinsic input...
          extrinsicCall = api.createType('Call', api.tx(extrinsicHex).method);
        } catch (e) {
          extrinsicCall = api.createType('Call', extrinsicHex);
        }

        const extrinsicHash = extrinsicCall.hash.toHex();
        const { method, section } = api.registry.findMetaCall(extrinsicCall.callIndex);
        const extrinsicFn = api.tx[section][method];

        setExtrinsicInfo({ ...DEFAULT_INFO, extrinsicCall, extrinsicFn, extrinsicHash, extrinsicHex });
      } catch (e) {
        setExtrinsicInfo({ ...DEFAULT_INFO, extrinsicError: (e as Error).message });
      }
    },
    [api]
  );

  return (
    <div className={className}>
      <Input
        isError={!extrinsicFn}
        label={t<string>('hex-encoded call')}
        onChange={_setExtrinsicHex}
        placeholder={t<string>('0x...')}
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
      {extrinsicHash && (
        <Output
          isDisabled
          label='encoded call hash'
          value={extrinsicHash}
          withCopy
        />
      )}
    </div>
  );
}

export default React.memo(Decoder);
