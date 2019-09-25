// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// TODO: We have a lot shared between this and InputExtrinsic

import { DropdownOptions } from '../util/types';
import { I18nProps } from '../types';
import { StorageEntryPromise } from './types';

import '../InputExtrinsic/InputExtrinsic.css';

import React, { useContext, useState } from 'react';
import { ApiContext } from '@polkadot/react-api';

import Labelled from '../Labelled';
import translate from '../translate';
import SelectKey from './SelectKey';
import SelectSection from './SelectSection';
import keyOptions from './options/key';
import sectionOptions from './options/section';

interface Props extends I18nProps {
  defaultValue: StorageEntryPromise;
  help?: React.ReactNode;
  isError?: boolean;
  label: React.ReactNode;
  onChange?: (value: StorageEntryPromise) => void;
  withLabel?: boolean;
}

function InputStorage ({ className, defaultValue, help, label, onChange, style, withLabel }: Props): React.ReactElement<Props> {
  const { api } = useContext(ApiContext);
  const [optionsMethod, setOptionsMethod] = useState<DropdownOptions>(keyOptions(api, defaultValue.creator.section));
  const [optionsSection] = useState<DropdownOptions>(sectionOptions(api));
  const [value, setValue] = useState<StorageEntryPromise>((): StorageEntryPromise => defaultValue);

  const _onKeyChange = (newValue: StorageEntryPromise): void => {
    if (value.creator.section === newValue.creator.section && value.creator.method === newValue.creator.method) {
      return;
    }

    // set via callback
    setValue((): StorageEntryPromise => newValue);
    onChange && onChange(newValue);
  };
  const _onSectionChange = (section: string): void => {
    if (section === value.creator.section) {
      return;
    }

    const optionsMethod = keyOptions(api, section);

    setOptionsMethod(optionsMethod);
    _onKeyChange(api.query[section][optionsMethod[0].value]);
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
            options={optionsSection}
            value={value}
          />
          <SelectKey
            className='large'
            onChange={_onKeyChange}
            options={optionsMethod}
            value={value}
          />
        </div>
      </Labelled>
    </div>
  );
}

export default translate(InputStorage);
