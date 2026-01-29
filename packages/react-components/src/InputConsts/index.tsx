// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { ConstantCodec } from '@polkadot/types/metadata/decorate/types';
import type { DropdownOptions } from '../util/types.js';
import type { ConstValue, ConstValueBase } from './types.js';

import React, { useCallback, useState } from 'react';

import { useApi } from '@polkadot/react-hooks';

import LinkedWrapper from '../InputExtrinsic/LinkedWrapper.js';
import keyOptions from './options/key.js';
import sectionOptions from './options/section.js';
import SelectKey from './SelectKey.js';
import SelectSection from './SelectSection.js';

interface Props {
  className?: string;
  defaultValue: ConstValueBase;
  isError?: boolean;
  label: React.ReactNode;
  onChange?: (value: ConstValue) => void;
  withLabel?: boolean;
}

function getValue (api: ApiPromise, { method, section }: ConstValueBase): ConstValue {
  const firstSec = Object.keys(api.consts)[0];
  const firstMet = Object.keys(api.consts[firstSec])[0];
  const value = api.consts[section]?.[method]
    ? { method, section }
    : { method: firstMet, section: firstSec };

  return {
    ...value,
    meta: (api.consts[value.section][value.method] as ConstantCodec).meta
  };
}

function InputConsts ({ className = '', defaultValue, label, onChange, withLabel }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const [optionsMethod, setOptionsMethod] = useState<DropdownOptions>(() => keyOptions(api, defaultValue.section));
  const [optionsSection] = useState<DropdownOptions>(() => sectionOptions(api));
  const [value, setValue] = useState<ConstValue>(() => getValue(api, defaultValue));

  const _onKeyChange = useCallback(
    (newValue: ConstValueBase): void => {
      if (value.section !== newValue.section || value.method !== newValue.method) {
        const { method, section } = newValue;
        const meta = (api.consts[section][method] as ConstantCodec).meta;
        const updated = { meta, method, section };

        setValue(updated);
        onChange && onChange(updated);
      }
    },
    [api, onChange, value]
  );

  const _onSectionChange = useCallback(
    (newSection: string): void => {
      if (newSection !== value.section) {
        const optionsMethod = keyOptions(api, newSection);

        setOptionsMethod(optionsMethod);
        _onKeyChange({ method: optionsMethod[0].value, section: newSection });
      }
    },
    [_onKeyChange, api, value]
  );

  return (
    <LinkedWrapper
      className={className}
      label={label}
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
