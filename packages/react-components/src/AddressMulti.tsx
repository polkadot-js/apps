// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from './types';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useDebounce } from '@polkadot/react-hooks';

import translate from './translate';
import AddressToggle from './AddressToggle';
import Input from './Input';

interface Props extends I18nProps {
  available: string[];
  className?: string;
  help: React.ReactNode;
  label: React.ReactNode;
  maxCount: number;
  onChange: (values: string[]) => void;
  value: string[];
}

function AddressMulti ({ available, className, help, label, maxCount, onChange, t, value }: Props): React.ReactElement<Props> {
  const [_filter, setFilter] = useState<string>('');
  const filter = useDebounce(_filter);

  const _onClick = (key: string): (isChecked: boolean) => void =>
    (isChecked: boolean): void => {
      let newValues = value.filter((address): boolean => address !== key);

      if (isChecked) {
        newValues = [key].concat(newValues).slice(0, maxCount);
      }

      onChange(newValues);
    };

  return (
    <div className={`ui--AddressMulti ${className}`}>
      <Input
        autoFocus
        className='ui--AddressMulti-input'
        help={help}
        label={label}
        onChange={setFilter}
        placeholder={t('partial name, address or account index')}
        value={_filter}
      />
      <div className='ui--AddressMulti-container'>
        {available.map((key): React.ReactNode => (
          <AddressToggle
            address={key}
            filter={filter}
            key={key}
            onChange={_onClick(key)}
            value={value.includes(key)}
          />
        ))}
      </div>
    </div>
  );
}

export default translate(
  styled(AddressMulti)`
    .ui--AddressMulti-input {
      .ui.input {
        margin-bottom: 0rem;

        input {
          border-bottom-width: 0px;
          border-bottom-right-radius: 0px;
          border-bottom-left-radius: 0px;
        }
      }
    }

    .ui--AddressMulti-container {
      background: white;
      border: 1px solid rgba(34,36,38,.15);
      border-top-width: 0px;
      border-radius: 0 0 0.25rem 0.25rem;
      margin-left: 2rem;
      max-height: 15rem;
      overflow-y: scroll;
      padding: 0.25rem 0.5rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .ui--AddressToggle {}
    }
  `
);
