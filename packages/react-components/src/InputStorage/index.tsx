// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

// TODO: We have a lot shared between this and InputExtrinsic

import type { QueryableStorageEntry } from '@polkadot/api/types';
import type { DropdownOptions } from '../util/types';

import React, { useCallback, useState } from 'react';

import { useApi } from '@polkadot/react-hooks';

import LinkedWrapper from '../InputExtrinsic/LinkedWrapper';
import keyOptions from './options/key';
import sectionOptions from './options/section';
import SelectKey from './SelectKey';
import SelectSection from './SelectSection';

interface Props {
  className?: string;
  defaultValue: QueryableStorageEntry<'promise'>;
  help?: React.ReactNode;
  isError?: boolean;
  label: React.ReactNode;
  onChange?: (value: QueryableStorageEntry<'promise'>) => void;
  withLabel?: boolean;
}

function InputStorage ({ className = '', defaultValue, help, label, onChange, withLabel }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const [optionsMethod, setOptionsMethod] = useState<DropdownOptions>(() => keyOptions(api, defaultValue.creator.section));
  const [optionsSection] = useState<DropdownOptions>(() => sectionOptions(api));
  const [value, setValue] = useState<QueryableStorageEntry<'promise'>>(() => defaultValue);

  const _onKeyChange = useCallback(
    (newValue: QueryableStorageEntry<'promise'>): void => {
      if (value.creator.section !== newValue.creator.section || value.creator.method !== newValue.creator.method) {
        // set via callback
        setValue(() => newValue);
        onChange && onChange(newValue);
      }
    },
    [onChange, value]
  );

  const _onSectionChange = useCallback(
    (section: string): void => {
      if (section !== value.creator.section) {
        const optionsMethod = keyOptions(api, section);

        setOptionsMethod(optionsMethod);
        _onKeyChange(api.query[section][optionsMethod[0].value] as any);
      }
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
      <SelectKey
        className='large'
        onChange={_onKeyChange}
        options={optionsMethod}
        value={value}
      />
    </LinkedWrapper>
  );
}

export default React.memo(InputStorage);
