// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import { DropdownOptions } from '../util/types';

import React, { useState } from 'react';
import { useApi } from '@polkadot/react-hooks';

import LinkedWrapper from './LinkedWrapper';
import SelectMethod from './SelectMethod';
import SelectSection from './SelectSection';
import methodOptions from './options/method';
import sectionOptions from './options/section';

interface Props {
  className?: string;
  defaultValue: SubmittableExtrinsicFunction<'promise'>;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  isPrivate?: boolean;
  label: React.ReactNode;
  onChange: (value: SubmittableExtrinsicFunction<'promise'>) => void;
  style?: any;
  withLabel?: boolean;
}

function InputExtrinsic ({ className, defaultValue, help, label, onChange, style, withLabel }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const [optionsMethod, setOptionsMethod] = useState<DropdownOptions>(methodOptions(api, defaultValue.section));
  const [optionsSection] = useState<DropdownOptions>(sectionOptions(api));
  const [value, setValue] = useState<SubmittableExtrinsicFunction<'promise'>>((): SubmittableExtrinsicFunction<'promise'> => defaultValue);

  const _onKeyChange = (newValue: SubmittableExtrinsicFunction<'promise'>): void => {
    if (value.section === newValue.section && value.method === newValue.method) {
      return;
    }

    // set this via callback, since the we are setting a function (alternatively... we have issues)
    setValue((): SubmittableExtrinsicFunction<'promise'> => newValue);
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
        api={api}
        className='large'
        onChange={_onKeyChange}
        options={optionsMethod}
        value={value}
      />
    </LinkedWrapper>
  );
}

export default React.memo(InputExtrinsic);
