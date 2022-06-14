// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { Dropdown, Icon } from './';

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
        <Icon
          className={`arrow up${sortDirection === 'ascending' ? ' isActive' : ''}`}
          color='gray'
          icon='sort-up'
        />
        <Icon
          className={`arrow down${sortDirection === 'descending' ? ' isActive' : ''}`}
          color='gray'
          icon='sort-down'
        />
      </button>
    </div>
  );
}

export default React.memo(styled(SortDropdown)`
  position: relative;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;

  && .ui--Labelled.ui--Dropdown {
    padding: 0;

    label {
      left: 1.55rem;
      z-index: 115;
    }

    .ui.selection.dropdown {
      margin:0;
      min-width: 7.857rem;
      z-index: 110;

      border-width: 1px 0 1px 1px;
      border-style: solid;
      border-color: var(--border-input);
      border-radius: 4px 0 0 4px;

      &.active {
        position: absolute;
        min-width: 10.714rem;

        z-index: 120;

        border-width: 1px;
        border-radius: 4px;
        top: 0;
        left: 0;
      }

      .visible.menu {
        border-color: var(--border-input);
      }
    }
  }

  button {
    position: relative;
    width: 2.857rem;
    height: 3.893rem;

    background-color: var(--bg-input);

    border-width: 1px 1px 1px 0;
    border-style: solid;
    border-color: var(--border-input);
    border-radius: 0 4px 4px 0;

    &:hover {
      cursor: pointer;
    }

    .arrow.down {
      position: absolute;
      top: calc(50% - 0.5rem);
      left: calc(50% - 0.313rem);
    }
  }

  &::after {
    content: '';
    position: absolute;
    left: 7.857rem;
    top: 10%;

    width: 1px;
    height: 80%;

    background-color: var(--border-input);
    z-index: 99;
  }

  button:hover,
  .ui--Labelled.ui--Dropdown:hover {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        height: 100%;
        width: 1px;
        z-index: 100;
      }
  }

  button:hover::after {
    left: 0;
  }

  .ui--Labelled.ui--Dropdown:hover::after {
    left: 7.857rem;
  }
`);
