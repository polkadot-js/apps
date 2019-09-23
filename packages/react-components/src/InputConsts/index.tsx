// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ConstantCodec } from '@polkadot/api-metadata/consts/types';
import { DropdownOptions } from '../util/types';
import { I18nProps } from '../types';
import { ConstValue, ConstValueBase } from './types';

import '../InputExtrinsic/InputExtrinsic.css';

import React, { useContext, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { ApiContext } from '@polkadot/react-api';

import Labelled from '../Labelled';
import translate from '../translate';
import SelectKey from './SelectKey';
import SelectSection from './SelectSection';
import keyOptions from './options/key';
import sectionOptions from './options/section';

interface Props extends I18nProps {
  defaultValue: ConstValueBase;
  help?: React.ReactNode;
  isError?: boolean;
  label: React.ReactNode;
  onChange?: (value: ConstValue) => void;
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
  const { api } = useContext(ApiContext);
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
    <div
      className={className}
      style={style}
    >
      <Labelled
        help={help}
        label={label}
        withLabel={withLabel}
      >
        <div className=' ui--DropdownLinked ui--row'>
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
        </div>
      </Labelled>
    </div>
  );
}

export default translate(InputConsts);
