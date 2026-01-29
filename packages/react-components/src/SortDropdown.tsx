// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DropdownItemProps } from 'semantic-ui-react';

import React from 'react';

import Dropdown from './Dropdown.js';
import Icon from './Icon.js';
import { styled } from './styled.js';

interface Props {
  className?: string;
  defaultValue: string;
  label: string;
  onChange: (value: any) => void;
  onClick: () => void;
  options: (DropdownItemProps | React.ReactNode)[];
  sortDirection: 'descending' | 'ascending';
}

function SortDropdown ({ className = '', defaultValue, label, onChange, onClick, options, sortDirection }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv className={`${className} ui--Sort`}>
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
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-right: 0.5rem;

  && .ui--Labelled.ui--Dropdown {
    padding: 0;

    label {
      left: 1.55rem;
      z-index: 115;
    }

    .ui.selection.dropdown {
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
    margin: 0.25rem 0;
    position: relative;
    width: 2.857rem;
    height: 3.893rem;

    background-color: var(--bg-input);
    border-width: 1px 1px 1px 0;
    border-style: solid;
    border-color: var(--border-input);
    border-radius: 0 4px 4px 0;

    align-items: center;
    display: flex;
    flex-flow: column;
    justify-content: center;

    &:hover {
      cursor: pointer;
    }

    .arrow {
      &:first-child {
        margin-bottom: -20%;
      }

      &:last-child {
        margin-top: -20%;
      }
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
`;

export default React.memo(SortDropdown);
