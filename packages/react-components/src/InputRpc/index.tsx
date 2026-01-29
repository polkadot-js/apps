// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

// TODO: We have a lot shared between this and InputExtrinsic & InputStorage

import type { DefinitionRpcExt } from '@polkadot/types/types';
import type { DropdownOptions } from '../util/types.js';

import React, { useCallback, useEffect, useState } from 'react';

import { useApi } from '@polkadot/react-hooks';

import LinkedWrapper from '../InputExtrinsic/LinkedWrapper.js';
import methodOptions from './options/method.js';
import sectionOptions from './options/section.js';
import SelectMethod from './SelectMethod.js';
import SelectSection from './SelectSection.js';
import useRpcs from './useRpcs.js';

interface Props {
  className?: string;
  defaultValue: DefinitionRpcExt;
  label: React.ReactNode;
  onChange?: (value: DefinitionRpcExt) => void;
  withLabel?: boolean;
}

function InputRpc ({ className = '', defaultValue, label, onChange, withLabel }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const rpcs = useRpcs();
  const [optionsMethod, setOptionsMethod] = useState<DropdownOptions>(() => methodOptions(api, rpcs, defaultValue.section));
  const [optionsSection] = useState<DropdownOptions>(() => sectionOptions(api));
  const [value, setValue] = useState<DefinitionRpcExt>((): DefinitionRpcExt => defaultValue);

  useEffect((): void => {
    onChange && onChange(value);
  }, [onChange, value]);

  const _onMethodChange = useCallback(
    (newValue: DefinitionRpcExt): void => {
      if (value !== newValue) {
        // set via callback since the method is a function itself
        setValue(() => newValue);
      }
    },
    [value]
  );

  const _onSectionChange = useCallback(
    (newSection: string): void => {
      if (newSection !== value.section) {
        const optionsMethod = methodOptions(api, rpcs, newSection);

        setOptionsMethod(optionsMethod);
        _onMethodChange(rpcs[newSection][optionsMethod[0].value]);
      }
    },
    [_onMethodChange, api, rpcs, value]
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
      <SelectMethod
        className='large'
        onChange={_onMethodChange}
        options={optionsMethod}
        value={value}
      />
    </LinkedWrapper>
  );
}

export default React.memo(InputRpc);
