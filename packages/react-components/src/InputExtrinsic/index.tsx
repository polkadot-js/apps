// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { DropdownOptions } from '../util/types';

import React, { useCallback, useState } from 'react';

import { useApi } from '@polkadot/react-hooks';

import methodOptions from './options/method';
import sectionOptions from './options/section';
import LinkedWrapper from './LinkedWrapper';
import SelectMethod from './SelectMethod';
import SelectSection from './SelectSection';

interface Props {
  className?: string;
  defaultValue: SubmittableExtrinsicFunction<'promise'>;
  filter?: (section: string, method?: string) => boolean;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  isPrivate?: boolean;
  label: React.ReactNode;
  onChange?: (value: SubmittableExtrinsicFunction<'promise'>) => void;
  withLabel?: boolean;
}

function InputExtrinsic ({ className = '', defaultValue, filter, help, isDisabled, label, onChange, withLabel }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const [optionsMethod, setOptionsMethod] = useState<DropdownOptions>(() => methodOptions(api, defaultValue.section, filter));
  const [optionsSection] = useState<DropdownOptions>(() => sectionOptions(api, filter));
  const [value, setValue] = useState<SubmittableExtrinsicFunction<'promise'>>((): SubmittableExtrinsicFunction<'promise'> => defaultValue);
  const [{ defaultMethod, defaultSection }] = useState(() => ({ defaultMethod: defaultValue.method, defaultSection: defaultValue.section }));

  const _onKeyChange = useCallback(
    (newValue: SubmittableExtrinsicFunction<'promise'>): void => {
      if (value !== newValue) {
        // set this via callback, since the we are setting a function (alternatively... we have issues)
        setValue((): SubmittableExtrinsicFunction<'promise'> => newValue);
        onChange && onChange(newValue);
      }
    },
    [onChange, value]
  );

  const _onSectionChange = useCallback(
    (newSection: string): void => {
      if (newSection !== value.section) {
        const optionsMethod = methodOptions(api, newSection, filter);

        setOptionsMethod(optionsMethod);
        _onKeyChange(api.tx[newSection][optionsMethod[0].value]);
      }
    },
    [_onKeyChange, api, filter, value]
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
        defaultValue={defaultSection}
        isDisabled={isDisabled}
        onChange={isDisabled ? undefined : _onSectionChange}
        options={optionsSection}
        value={value}
      />
      <SelectMethod
        api={api}
        className='large'
        defaultValue={defaultMethod}
        isDisabled={isDisabled}
        onChange={isDisabled ? undefined : _onKeyChange}
        options={optionsMethod}
        value={value}
      />
    </LinkedWrapper>
  );
}

export default React.memo(InputExtrinsic);
