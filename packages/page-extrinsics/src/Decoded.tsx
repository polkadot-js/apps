// Copyright 2017-2022 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Inspect } from '@polkadot/types/types';

import React, { useMemo } from 'react';

import { Columar, Output } from '@polkadot/react-components';
import { u8aToHex } from '@polkadot/util';

import DecodedInspect from './DecodedInspect';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  extrinsic?: SubmittableExtrinsic<'promise'> | null;
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
    extrinsic.method.inspect()
  ];
}

function Decoded ({ className, extrinsic }: Props): React.ReactElement<Props> | null {
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
        <Output
          isDisabled
          isTrimmed
          label={t<string>('encoded call data')}
          value={hex}
          withCopy
        />
        <Output
          isDisabled
          label={t<string>('encoded call hash')}
          value={hash}
          withCopy
        />
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

export default React.memo(Decoded);
