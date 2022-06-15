// Copyright 2017-2022 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Inspect } from '@polkadot/types/types';
import type { HexString } from '@polkadot/util/types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Columar, Inspect as DecodedInspect, Output } from '@polkadot/react-components';
import { u8aToHex } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  extrinsic?: SubmittableExtrinsic<'promise'> | null;
  isCall: boolean;
  withData?: boolean;
  withHash?: boolean;
}

function extract (isCall: boolean, extrinsic?: SubmittableExtrinsic<'promise'> | null): [HexString, HexString, Inspect | null] {
  if (!extrinsic) {
    return ['0x', '0x', null];
  }

  const u8a = extrinsic.method.toU8a();

  // don't use the built-in hash, we only want to convert once
  return [
    u8aToHex(u8a),
    extrinsic.registry.hash(u8a).toHex(),
    isCall
      ? extrinsic.method.inspect()
      : extrinsic.inspect()
  ];
}

function Decoded ({ className, extrinsic, isCall, withData = true, withHash = true }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  const [hex, hash, inspect] = useMemo(
    () => extract(isCall, extrinsic),
    [extrinsic, isCall]
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
          hex={hex}
          inspect={inspect}
          label={t<string>('encoding details')}
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
