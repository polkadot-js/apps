// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ConstantCodec } from '@polkadot/metadata/Decorated/types';
import { DropdownOptions } from '../util/types';
import { ConstValue, ConstValueBase } from './types';

import React, { useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { useApi } from '@polkadot/react-hooks';

import LinkedWrapper from '../InputExtrinsic/LinkedWrapper';
import SelectKey from './SelectKey';
import SelectSection from './SelectSection';
import keyOptions from './options/key';
import sectionOptions from './options/section';

interface Props {
  className?: string;
  defaultValue: ConstValueBase;
  help?: React.ReactNode;
  isError?: boolean;
  label: React.ReactNode;
  onChange?: (value: ConstValue) => void;
  style?: any;
  withLabel?: boolean;
}

function getValue (api: ApiPromise, { method, section }: ConstValueBase): ConstValue {
  const firstSec = Object.keys(api.consts)[0];
  const firstMet = Object.keys(api.consts[firstSec])[0];
  const value = (api.consts[section] && api.consts[section][method])
    ? { method, section }
    : { method: firstMet, section: firstSec };

  return {
    ...value,
    meta: (api.consts[value.section][value.method] as ConstantCodec).meta
  };
}

function InputConsts ({ className, defaultValue, help, label, onChange, style, withLabel }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const [optionsMethod, setOptionsMethod] = useState<DropdownOptions>(keyOptions(api, defaultValue.section));
  const [optionsSection] = useState<DropdownOptions>(sectionOptions(api));
  const [value, setValue] = useState<ConstValue>(getValue(api, defaultValue));

  const _onKeyChange = (newValue: ConstValueBase): void => {
    if (value.section === newValue.section && value.method === newValue.method) {
      return;
    }

    const { method, section } = newValue;
    const meta = (api.consts[section][method] as ConstantCodec).meta;
    const updated = { meta, method, section };

    setValue(updated);
    onChange && onChange(updated);
  };
  const _onSectionChange = (section: string): void => {
    if (section === value.section) {
      return;
    }

    const optionsMethod = keyOptions(api, section);

    setOptionsMethod(optionsMethod);
    _onKeyChange({ method: optionsMethod[0].value, section });
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
      <SelectKey
        className='large'
        onChange={_onKeyChange}
        options={optionsMethod}
        value={value}
      />
    </LinkedWrapper>
  );
}

export default React.memo(InputConsts);
