// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDebounce, useLoadingDelay } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Input from '../Input';
import Spinner from '../Spinner';
import Available from './Available';
import Selected from './Selected';

interface Props {
  available: string[];
  availableLabel: React.ReactNode;
  className?: string;
  defaultValue?: string[];
  help: React.ReactNode;
  maxCount: number;
  onChange: (values: string[]) => void;
  valueLabel: React.ReactNode;
}

function InputAddressMulti ({ available, availableLabel, className = '', defaultValue, maxCount, onChange, valueLabel }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [_filter, setFilter] = useState<string>('');
  const [selected, setSelected] = useState<string[]>([]);
  const filter = useDebounce(_filter);
  const isLoading = useLoadingDelay();

  useEffect((): void => {
    defaultValue && setSelected(defaultValue);
  }, [defaultValue]);

  useEffect((): void => {
    selected && onChange(selected);
  }, [onChange, selected]);

  const _onSelect = useCallback(
    (address: string): void =>
      setSelected(
        (selected: string[]) =>
          !selected.includes(address) && (selected.length < maxCount)
            ? selected.concat(address)
            : selected
      ),
    [maxCount]
  );

  const _onDeselect = useCallback(
    (address: string): void =>
      setSelected(
        (selected: string[]) =>
          selected.includes(address)
            ? selected.filter((a) => a !== address)
            : selected
      ),
    []
  );

  return (
    <div className={`ui--InputAddressMulti ${className}`}>
      <Input
        autoFocus
        className='ui--InputAddressMulti-Input label-small'
        onChange={setFilter}
        placeholder={t<string>('filter by name, address, or account index')}
        value={_filter}
        withLabel={false}
      />
      <div className='ui--InputAddressMulti-columns'>
        <div className='ui--InputAddressMulti-column'>
          <label>{valueLabel}</label>
          <div className='ui--InputAddressMulti-items'>
            {selected.map((address): React.ReactNode => (
              <Selected
                address={address}
                key={address}
                onDeselect={_onDeselect}
              />
            ))}
          </div>
        </div>
        <div className='ui--InputAddressMulti-column'>
          <label>{availableLabel}</label>
          <div className='ui--InputAddressMulti-items'>
            {isLoading
              ? <Spinner />
              : (
                available.map((address) => (
                  <Available
                    address={address}
                    filter={filter}
                    isHidden={selected?.includes(address)}
                    key={address}
                    onSelect={_onSelect}
                  />
                ))
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(styled(InputAddressMulti)`
  border-top-width: 0px;
  margin-left: 2rem;
  width: calc(100% - 2rem);

  .ui--InputAddressMulti-Input {
    .ui.input {
      margin-bottom: 0.25rem;
      opacity: 1 !important;
    }
  }

  .ui--InputAddressMulti-columns {
    display: inline-flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    width: 100%;

    .ui--InputAddressMulti-column {
      display: flex;
      flex-direction: column;
      min-height: 15rem;
      max-height: 15rem;
      width: 50%;
      padding: 0.25rem 0.5rem;

      .ui--InputAddressMulti-items {
        padding: 0.5rem 0;
        background: white;
        border: 1px solid rgba(34,36,38,0.15);
        border-radius: 0.286rem 0.286rem;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;

        .ui--Spinner {
          margin-top: 2rem;
        }

        .ui--AddressToggle {
          padding-left: 0.75rem;
        }

        .ui--AddressMini-address {
          min-width: auto;
          max-width: 100%;
        }
      }
    }
  }
`);
