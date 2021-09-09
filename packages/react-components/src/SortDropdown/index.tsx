// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { ArrowDown, ArrowUp } from '@polkadot/react-components/SortDropdown/Arrows';

import { Dropdown } from '../';

interface Props {
  className?: string;
  defaultValue: string;
  label: string;
  onChange: (value: unknown) => void;
  onClick: () => void;
  options: unknown[];
  sortDirection: 'descending' | 'ascending';
}

function SortDropdown ({ className = '', defaultValue, label, onChange, onClick, options, sortDirection }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--Sort ${className}`}>
      <Dropdown
        defaultValue={defaultValue}
        label={label}
        onChange={onChange}
        options={options}
      />
      <button onClick={onClick}>
        <ArrowUp active={sortDirection === 'ascending'} />
        <ArrowDown active={sortDirection === 'descending'} />
      </button>
    </div>
  );
}

export default React.memo(styled(SortDropdown)`
  width: 196px;
  position: relative;

  && .ui--Dropdown.ui--Labelled {
    padding: 0;
    width: 100%;

    .ui.selection.dropdown {
      margin: 0;
    }

    label {
      left: 1.5rem;
    }
  }

  button {
    position: absolute;
    right: 0;
    top: 0;

    height: 100%;
    width: 40px;

    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    justify-content: center;

    border-style: solid;
    border-width: 1px 1px 1px 0;
    border-color: rgba(34,36,38,.15);
    border-radius: 0 .286rem .286rem 0;

    background-color: var(--bg-input);


    &:hover::after {
      background-color: transparent;
    }

    &::after {
      content: '';
      position: absolute;
      left: -1px;
      width: 1px;
      height: 75%;
      background-color: rgba(34,36,38,.15);
    }
  }

  .svg--arrow:first-of-type {
    margin-bottom: 0.2rem;
  }

  button:hover {
    cursor: pointer;
  }
`);
