// Copyright 2017-2022 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Inspect } from '@polkadot/types/types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Columar, Inspect as DecodedInspect, Output } from '@polkadot/react-components';
import { u8aToHex } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  extrinsic?: SubmittableExtrinsic<'promise'> | null;
  withData?: boolean;
  withHash?: boolean;
}

function extract (extrinsic?: SubmittableExtrinsic<'promise'> | null): [string, string, Inspect | null] {
  if (!extrinsic) {
    return ['0x', '0x', null];
  }

  const u8a = extrinsic.method.toU8a();

  // don't use the built-in hash, we only want to convert once
  return [
    u8aToHex(u8a),
    extrinsic.registry.hash(u8a).toHex(),
    // 0x410284009a81870b7ba4774b2a7efc31a635ec4042088d97ecbdaaf9552c3e21f74aae5201122fea94623d7aecda9870009506865a666d8a962aa2b58f12d5b512258f1a0aab569d7982bfd616c90d7ccf6960dadb29c5de46d2da73a159f5c6bbd5206f8b85029c00040300429599ba5f521844f2332524dec987f9cfb116a2570f83b2417184af0c74ab130700743ba40b
    extrinsic.isSigned
      ? extrinsic.inspect()
      : extrinsic.method.inspect()
  ];
}

function Decoded ({ className, extrinsic, withData = true, withHash = true }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  const [hex, hash, inspect] = useMemo(
    () => extract(extrinsic),
    [extrinsic]
  );

  if (!inspect) {
    return null;
  }

  return (
    <Columar
      className={className}
      isPadded={false}
    >
      <Columar.Column>
        {withData && (
          <Output
            isDisabled
            isTrimmed
            label={t<string>('encoded call data')}
            value={hex}
            withCopy
          />
        )}
        {withHash && (
          <Output
            isDisabled
            label={t<string>('encoded call hash')}
            value={hash}
            withCopy
          />
        )}
      </Columar.Column>
      <Columar.Column>
        <DecodedInspect
          inspect={inspect}
          label={t<string>('encoded call details')}
        />
      </Columar.Column>
    </Columar>
  );
}

export default React.memo(styled(Decoded)`
  .ui--Column:last-child .ui--Labelled {
    padding-left: 0.5rem;

    label {
      left: 2.05rem; /* 3.55 - 1.5 (diff from padding above) */
    }
  }
`);
