// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CallFunction } from '@polkadot/types/types';
import { I18nProps } from '../types';
import { DropdownOptions } from '../util/types';

import './InputExtrinsic.css';

import React, { useContext, useEffect, useRef, useState } from 'react';
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

interface Options {
  method?: DropdownOptions;
  section?: DropdownOptions;
}

function InputExtrinsic ({ className, defaultValue, help, label, onChange, style, withLabel }: Props): React.ReactElement<Props> {
  const { api } = useContext(ApiContext);
  const [options, setOptions] = useState<Options>({});
  const valueRef = useRef<CallFunction>(defaultValue);

  useEffect((): void => {
    setOptions({
      method: methodOptions(api, valueRef.current.section),
      section: sectionOptions(api)
    });
  }, [valueRef.current]);

  const _onKeyChange = (newValue: CallFunction): void => {
    if (valueRef.current.section === newValue.section && valueRef.current.method === newValue.method) {
      return;
    }

    valueRef.current = newValue;
    onChange(newValue);
  };
  const _onSectionChange = (newSection: string): void => {
    if (newSection === valueRef.current.section) {
      return;
    }

    const optionsMethod = methodOptions(api, newSection);

    _onKeyChange(api.tx[newSection][optionsMethod[0].value]);
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
            options={options.section || []}
            value={valueRef.current}
          />
          <SelectMethod
            api={api}
            className='large'
            onChange={_onKeyChange}
            options={options.method || []}
            value={valueRef.current}
          />
        </div>
      </Labelled>
    </div>
  );
}

export default translate(InputExtrinsic);
