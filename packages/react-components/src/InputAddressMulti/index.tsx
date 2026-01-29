// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useState } from 'react';

import { useDebounce, useNextTick } from '@polkadot/react-hooks';

import Input from '../Input.js';
import Spinner from '../Spinner.js';
import { styled } from '../styled.js';
import { useTranslation } from '../translate.js';
import Available from './Available.js';
import Selected from './Selected.js';

interface Props {
  available: string[];
  availableLabel: React.ReactNode;
  className?: string;
  defaultValue?: string[];
  maxCount: number;
  onChange: (values: string[]) => void;
  valueLabel: React.ReactNode;
}

function exclude (prev: string[], address: string): string[] {
  return prev.includes(address)
    ? prev.filter((a) => a !== address)
    : prev;
}

function include (prev: string[], address: string, maxCount: number): string[] {
  return !prev.includes(address) && (prev.length < maxCount)
    ? prev.concat(address)
    : prev;
}

function InputAddressMulti ({ available, availableLabel, className = '', defaultValue, maxCount, onChange, valueLabel }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [_filter, setFilter] = useState<string>('');
  const [selected, setSelected] = useState<string[]>([]);
  const filter = useDebounce(_filter);
  const isNextTick = useNextTick();

  useEffect((): void => {
    defaultValue && setSelected(defaultValue);
  }, [defaultValue]);

  useEffect((): void => {
    selected && onChange(selected);
  }, [onChange, selected]);

  const onSelect = useCallback(
    (address: string) => setSelected((prev) => include(prev, address, maxCount)),
    [maxCount]
  );

  const onDeselect = useCallback(
    (address: string) => setSelected((prev) => exclude(prev, address)),
    []
  );

  return (
    <StyledDiv className={`${className} ui--InputAddressMulti`}>
      <Input
        autoFocus
        className='ui--InputAddressMulti-Input'
        isSmall
        onChange={setFilter}
        placeholder={t('filter by name, address, or account index')}
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
                onDeselect={onDeselect}
              />
            ))}
          </div>
        </div>
        <div className='ui--InputAddressMulti-column'>
          <label>{availableLabel}</label>
          <div className='ui--InputAddressMulti-items'>
            {isNextTick
              ? available.map((address) => (
                <Available
                  address={address}
                  filter={filter}
                  isHidden={selected?.includes(address)}
                  key={address}
                  onSelect={onSelect}
                />
              ))
              : <Spinner />
            }
          </div>
        </div>
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
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
        background: var(--bg-input);
        border: 1px solid var(--border-input);
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

        .ui--AddressMini-info {
          max-width: 100%;
        }
      }
    }
  }
`;

export default React.memo(InputAddressMulti);
