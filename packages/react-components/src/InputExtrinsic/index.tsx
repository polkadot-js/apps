// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import { DropdownOptions } from '../util/types';

import React, { useCallback, useState } from 'react';
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
  withLabel?: boolean;
}

function InputExtrinsic ({ className = '', defaultValue, help, label, onChange, withLabel }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const [optionsMethod, setOptionsMethod] = useState<DropdownOptions>(methodOptions(api, defaultValue.section));
  const [optionsSection] = useState<DropdownOptions>(sectionOptions(api));
  const [value, setValue] = useState<SubmittableExtrinsicFunction<'promise'>>((): SubmittableExtrinsicFunction<'promise'> => defaultValue);

  const _onKeyChange = useCallback(
    (newValue: SubmittableExtrinsicFunction<'promise'>): void => {
      if (value.section === newValue.section && value.method === newValue.method) {
        return;
      }

      // set this via callback, since the we are setting a function (alternatively... we have issues)
      setValue((): SubmittableExtrinsicFunction<'promise'> => newValue);
      onChange(newValue);
    },
    [onChange, value]
  );

  const _onSectionChange = useCallback(
    (section: string): void => {
      if (section === value.section) {
        return;
      }

      const optionsMethod = methodOptions(api, section);

      setOptionsMethod(optionsMethod);
      _onKeyChange(api.tx[section][optionsMethod[0].value]);
    },
    [_onKeyChange, api, value]
  );

  return (
    <LinkedWrapper
      className={className}
      help={help}
      label={label}
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
