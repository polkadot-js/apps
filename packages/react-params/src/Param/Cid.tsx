// Copyright 2017-2022 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from '../types';

import React, { useCallback, useState } from 'react';

import { Input } from '@polkadot/react-components';

import { fromIpfsCid } from '../util';
import Bare from './Bare';
import Struct from './Struct';

function Cid (props: Props): React.ReactElement<Props> {
  const { className = '', defaultValue, isDisabled, isError, label, onChange, registry, withLabel } = props;
  const [isValid, setIsValid] = useState(false);
  const [isStruct] = useState<boolean>(() => isDisabled || !defaultValue || defaultValue.value instanceof registry.createClass('PalletAllianceCid'));

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

  if (isStruct) {
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
