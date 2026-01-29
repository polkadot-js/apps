// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletAllianceCid } from '@polkadot/types/lookup';
import type { Props } from '../types.js';

import React, { useCallback, useState } from 'react';

import { Input } from '@polkadot/react-components';
import { isCodec } from '@polkadot/util';

import { fromIpfsCid, toIpfsCid } from '../util.js';
import Bare from './Bare.js';
import Static from './Static.js';
import Struct from './Struct.js';

function Cid (props: Props): React.ReactElement<Props> {
  const { className = '', defaultValue, isDisabled, isError, label, onChange, withLabel } = props;
  const [isValid, setIsValid] = useState(false);
  const [ipfsCid] = useState<string | null>(() =>
    isDisabled && defaultValue && isCodec(defaultValue.value)
      ? toIpfsCid(defaultValue.value as PalletAllianceCid)
      : null
  );
  const [isStruct] = useState<boolean>(() => isDisabled || !defaultValue || isCodec(defaultValue.value));

  const _onChange = useCallback(
    (_value: string): void => {
      const value = fromIpfsCid(_value);
      const isValid = !!value;

      onChange && onChange({
        isValid,
        value
      });
      setIsValid(isValid);
    },
    [onChange]
  );

  if (ipfsCid) {
    return (
      <Static {...props}>
        <Input
          className='full'
          isDisabled
          label='ipfs'
          type='text'
          value={ipfsCid}
          withLabel={withLabel}
        />
      </Static>
    );
  } else if (isStruct) {
    return <Struct {...props} />;
  }

  return (
    <Bare className={className}>
      <Input
        className='full'
        isDisabled={isDisabled}
        isError={isError || !isValid}
        label={label}
        onChange={_onChange}
        placeholder='IPFS compatible CID'
        type='text'
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(Cid);
