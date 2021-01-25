// Copyright 2017-2021 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */

import type { Option } from '@polkadot/types';
import type { PrefabWasmModule } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import { InfoForInput } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { isHex } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  codeHash?: string | null;
  onChange: React.Dispatch<boolean>;
}

function ValidateCode ({ codeHash, onChange }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { t } = useTranslation();
  const codeStorage = useCall<Option<PrefabWasmModule>>((api.query.contracts || api.query.contract).codeStorage, [codeHash]);
  const [isValidHex, isValid] = useMemo(
    (): [boolean, boolean] => {
      const isValidHex = !!codeHash && isHex(codeHash) && codeHash.length === 66;
      const isStored = !!codeStorage && codeStorage.isSome;
      const isValid = isValidHex && isStored;

      onChange(isValid);

      return [
        isValidHex,
        isValid
      ];
    },
    [codeHash, codeStorage, onChange]
  );

  if (isValid || !isValidHex) {
    return null;
  }

  return (
    <InfoForInput type='error'>
      {
        isValidHex
          ? t('Unable to find on-chain WASM code for the supplied codeHash')
          : t('The codeHash is not a valid hex hash')
      }
    </InfoForInput>
  );
}

export default React.memo(ValidateCode);
