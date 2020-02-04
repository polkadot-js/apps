// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// TODO: We have a lot shared between this and InputExtrinsic & InputStorage

import { RpcMethod } from '@polkadot/jsonrpc/types';
import { DropdownOptions } from '../util/types';

import React, { useState } from 'react';
import map from '@polkadot/jsonrpc';
import { useApi } from '@polkadot/react-hooks';

import LinkedWrapper from '../InputExtrinsic/LinkedWrapper';
import SelectMethod from './SelectMethod';
import SelectSection from './SelectSection';
import methodOptions from './options/method';
import sectionOptions from './options/section';

interface Props {
  className?: string;
  defaultValue: RpcMethod;
  help?: React.ReactNode;
  isError?: boolean;
  label: React.ReactNode;
  onChange?: (value: RpcMethod) => void;
  style?: any;
  withLabel?: boolean;
}

export default function InputRpc ({ className, defaultValue, help, label, onChange, style, withLabel }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const [optionsMethod, setOptionsMethod] = useState<DropdownOptions>(methodOptions(api, defaultValue.section));
  const [optionsSection] = useState<DropdownOptions>(sectionOptions(api));
  const [value, setValue] = useState<RpcMethod>((): RpcMethod => defaultValue);

  const _onMethodChange = (newValue: RpcMethod): void => {
    if (value.section === newValue.section && value.method === newValue.method) {
      return;
    }

    // set via callback since the method is a function itself
    setValue((): RpcMethod => newValue);
    onChange && onChange(newValue);
  };
  const _onSectionChange = (section: string): void => {
    if (section === value.section) {
      return;
    }

    const optionsMethod = methodOptions(api, section);

    setOptionsMethod(optionsMethod);
    _onMethodChange(map[section].methods[optionsMethod[0].value]);
  };

  return (
    <LinkedWrapper
      className={className}
      help={help}
      label={label}
      style={style}
      withLabel={withLabel}
    >
      <SelectSection
        className='small'
        onChange={_onSectionChange}
        options={optionsSection}
        value={value}
      />
      <SelectMethod
        className='large'
        onChange={_onMethodChange}
        options={optionsMethod}
        value={value}
      />
    </LinkedWrapper>
  );
}
