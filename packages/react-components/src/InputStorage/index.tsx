// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// TODO: We have a lot shared between this and InputExtrinsic

import { DropdownOptions } from '../util/types';
import { StorageEntryPromise } from './types';

import React, { useCallback, useState } from 'react';
import { useApi } from '@polkadot/react-hooks';

import LinkedWrapper from '../InputExtrinsic/LinkedWrapper';
import SelectKey from './SelectKey';
import SelectSection from './SelectSection';
import keyOptions from './options/key';
import sectionOptions from './options/section';

interface Props {
  className?: string;
  defaultValue: StorageEntryPromise;
  help?: React.ReactNode;
  isError?: boolean;
  label: React.ReactNode;
  onChange?: (value: StorageEntryPromise) => void;
  style?: any;
  withLabel?: boolean;
}

function InputStorage ({ className, defaultValue, help, label, onChange, style, withLabel }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const [optionsMethod, setOptionsMethod] = useState<DropdownOptions>(keyOptions(api, defaultValue.creator.section));
  const [optionsSection] = useState<DropdownOptions>(sectionOptions(api));
  const [value, setValue] = useState<StorageEntryPromise>((): StorageEntryPromise => defaultValue);

  const _onKeyChange = useCallback(
    (newValue: StorageEntryPromise): void => {
      if (value.creator.section === newValue.creator.section && value.creator.method === newValue.creator.method) {
        return;
      }

      // set via callback
      setValue((): StorageEntryPromise => newValue);
      onChange && onChange(newValue);
    },
    [onChange, value]
  );

  const _onSectionChange = useCallback(
    (section: string): void => {
      if (section === value.creator.section) {
        return;
      }

      const optionsMethod = keyOptions(api, section);

      setOptionsMethod(optionsMethod);
      _onKeyChange(api.query[section][optionsMethod[0].value]);
    },
    [_onKeyChange, api, value]
  );

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
