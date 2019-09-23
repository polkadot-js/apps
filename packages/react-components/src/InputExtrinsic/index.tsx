// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CallFunction } from '@polkadot/types/types';
import { I18nProps } from '../types';
import { DropdownOptions } from '../util/types';

import './InputExtrinsic.css';

import React, { useContext, useState } from 'react';
import { ApiContext } from '@polkadot/react-api';

import Labelled from '../Labelled';
import translate from '../translate';
import SelectMethod from './SelectMethod';
import SelectSection from './SelectSection';
import methodOptions from './options/method';
import sectionOptions from './options/section';

interface Props extends I18nProps {
  defaultValue: CallFunction;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  isPrivate?: boolean;
  label: React.ReactNode;
  onChange: (value: CallFunction) => void;
  withLabel?: boolean;
}

function InputExtrinsic ({ className, defaultValue, help, label, onChange, style, withLabel }: Props): React.ReactElement<Props> {
  const { api } = useContext(ApiContext);
  const [optionsMethod, setOptionsMethod] = useState<DropdownOptions>(methodOptions(api, defaultValue.section));
  const [optionsSection] = useState<DropdownOptions>(sectionOptions(api));
  const [value, setValue] = useState<CallFunction>((): CallFunction => defaultValue);

  const _onKeyChange = (newValue: CallFunction): void => {
    if (value.section === newValue.section && value.method === newValue.method) {
      return;
    }

    // set this via callback, since the we are setting a function (aletrnatively... we have issues)
    setValue((): CallFunction => newValue);
    onChange(newValue);
  };
  const _onSectionChange = (section: string): void => {
    if (section === value.section) {
      return;
    }

    const optionsMethod = methodOptions(api, section);

    setOptionsMethod(optionsMethod);
    _onKeyChange(api.tx[section][optionsMethod[0].value]);
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
          <SelectMethod
            api={api}
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

export default translate(InputExtrinsic);
