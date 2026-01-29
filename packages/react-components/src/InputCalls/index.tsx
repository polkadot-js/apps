// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

// TODO: We have a lot shared between this and InputExtrinsic & InputStorage

import type { DefinitionCallNamed } from '@polkadot/types/types';
import type { DropdownOptions } from '../util/types.js';

import React, { useCallback, useEffect, useState } from 'react';

import LinkedWrapper from '../InputExtrinsic/LinkedWrapper.js';
import methodOptions from './options/method.js';
import sectionOptions from './options/section.js';
import SelectMethod from './SelectMethod.js';
import SelectSection from './SelectSection.js';
import useRuntime from './useRuntime.js';

interface Props {
  className?: string;
  label: React.ReactNode;
  onChange?: (value: DefinitionCallNamed) => void;
  withLabel?: boolean;
}

function InputCalls ({ className, label, onChange, withLabel }: Props): React.ReactElement<Props> | null {
  const [defs, defaultValue] = useRuntime();
  const [optionsSection] = useState<DropdownOptions>(() => sectionOptions(defs));
  const [optionsMethod, setOptionsMethod] = useState<DropdownOptions>(() => methodOptions(defs, defaultValue?.section));
  const [value, setValue] = useState<DefinitionCallNamed | null>(() => defaultValue);

  useEffect((): void => {
    value && onChange && onChange(value);
  }, [onChange, value]);

  const _onMethodChange = useCallback(
    (newValue: DefinitionCallNamed): void => {
      if (value !== newValue) {
        // set via callback since the method is a function itself
        setValue(() => newValue);
      }
    },
    [value]
  );

  const _onSectionChange = useCallback(
    (newSection: string): void => {
      if (value && newSection !== value.section) {
        const optionsMethod = methodOptions(defs, newSection);

        setOptionsMethod(optionsMethod);
        _onMethodChange(defs[newSection][optionsMethod[0].value]);
      }
    },
    [_onMethodChange, defs, value]
  );

  if (!value) {
    return null;
  }

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
        defs={defs}
        onChange={_onMethodChange}
        options={optionsMethod}
        value={value}
      />
    </LinkedWrapper>
  );
}

export default React.memo(InputCalls);
