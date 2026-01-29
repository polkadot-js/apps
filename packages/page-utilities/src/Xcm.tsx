// Copyright 2017-2025 @polkadot/app-utilities authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RawParamOnChangeValue } from '@polkadot/react-params/types';
import type { HexString } from '@polkadot/util/types';

import React, { useCallback, useState } from 'react';

import { statics } from '@polkadot/react-api';
import { Output } from '@polkadot/react-components';
import { createValue, Holder, ParamComp } from '@polkadot/react-params';
import { getTypeDef } from '@polkadot/types/create';
import { u8aToHex } from '@polkadot/util';

function Xcm (): React.ReactElement {
  const VersionedXcmTypeDef = getTypeDef('XcmVersionedXcm');
  const [encodedXcm, setEncodedXcm] = useState<HexString>('0x');

  const onChange = useCallback(
    (_index: number, rawXcm: RawParamOnChangeValue): void => {
      const xcm = statics.api.createType(VersionedXcmTypeDef.type, rawXcm.value);

      setEncodedXcm(u8aToHex(xcm.toU8a()));
    },
    [VersionedXcmTypeDef.type]
  );

  return (
    <Holder>
      <ParamComp
        defaultValue={ createValue(statics.api.registry, { type: VersionedXcmTypeDef }) }
        index={0}
        onChange={onChange}
        registry={statics.api.registry}
        type={VersionedXcmTypeDef}
      />
      <Output
        isDisabled={true}
        value={encodedXcm}
        withCopy={true}
      />
    </Holder>
  );
}

export default React.memo(Xcm);
