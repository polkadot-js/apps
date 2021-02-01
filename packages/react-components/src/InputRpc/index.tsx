// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

// TODO: We have a lot shared between this and InputExtrinsic & InputStorage

import type { DefinitionRpcExt } from '@polkadot/types/types';
import type { DropdownOptions } from '../util/types';

import React, { useCallback, useEffect, useState } from 'react';

import { useApi } from '@polkadot/react-hooks';

import LinkedWrapper from '../InputExtrinsic/LinkedWrapper';
import methodOptions from './options/method';
import sectionOptions from './options/section';
import SelectMethod from './SelectMethod';
import SelectSection from './SelectSection';
import useRpcs from './useRpcs';

interface Props {
  className?: string;
  defaultValue: DefinitionRpcExt;
  help?: React.ReactNode;
  isError?: boolean;
  label: React.ReactNode;
  onChange?: (value: DefinitionRpcExt) => void;
  withLabel?: boolean;
}

function InputRpc ({ className = '', defaultValue, help, label, onChange, withLabel }: Props): React.ReactElement<Props> {
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
      if (value.section === newValue.section && value.method === newValue.method) {
        return;
      }

      // set via callback since the method is a function itself
      setValue(() => newValue);
    },
    [value]
  );

  const _onSectionChange = useCallback(
    (section: string): void => {
      if (section === value.section) {
        return;
      }

      const optionsMethod = methodOptions(api, rpcs, section);

      setOptionsMethod(optionsMethod);
      _onMethodChange(rpcs[section][optionsMethod[0].value]);
    },
    [_onMethodChange, api, rpcs, value]
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
        className='large'
        onChange={_onMethodChange}
        options={optionsMethod}
        value={value}
      />
    </LinkedWrapper>
  );
}

export default React.memo(InputRpc);
