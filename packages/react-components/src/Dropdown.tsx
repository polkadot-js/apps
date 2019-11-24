// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React, { useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import SUIDropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';
import { isUndefined } from '@polkadot/util';

import { classes } from './util';
import Labelled from './Labelled';

interface Props<Option> extends BareProps {
  allowAdd?: boolean;
  defaultValue?: any;
  dropdownClassName?: string;
  help?: React.ReactNode;
  isButton?: boolean;
  isDisabled?: boolean;
  isError?: boolean;
  isMultiple?: boolean;
  label?: React.ReactNode;
  labelExtra?: React.ReactNode;
  onAdd?: (value: any) => void;
  onBlur?: () => void;
  onChange?: (value: any) => void;
  onClose?: () => void;
  onSearch?: (filteredOptions: any[], query: string) => Option[];
  options: Option[];
  placeholder?: string;
  renderLabel?: (item: any) => any;
  searchInput?: { autoFocus: boolean };
  transform?: (value: any) => any;
  value?: any;
  withEllipsis?: boolean;
  withLabel?: boolean;
}

function Dropdown<Option> ({ allowAdd = false, className, defaultValue, dropdownClassName, help, isButton, isDisabled, isError, isMultiple, label, labelExtra, onAdd, onBlur, onChange, onClose, onSearch, options, placeholder, renderLabel, searchInput, style, transform, withEllipsis, withLabel, value }: Props<Option>): React.ReactElement<Props<Option>> {
  const valueProp = useMemo(
    () => isUndefined(value) ? defaultValue : value,
    [defaultValue, value]
  );
  const valueRef = useRef<any>();

  const _onAdd = (_: React.SyntheticEvent<HTMLElement>, { value }: DropdownProps): void =>
    onAdd && onAdd(value);

  const handleOnChange = (value: any): void => {
    valueRef.current = value;
    onChange && onChange(
      transform
        ? transform(value)
        : value
    );
  };

  const _onChange = (_: React.SyntheticEvent<HTMLElement> | null, { value }: DropdownProps): void => {
    if (JSON.stringify({ v: valueProp }) === JSON.stringify({ v: value })) {
      return;
    }
    handleOnChange(value);
  };

  useEffect(() => {
    if (JSON.stringify({ v: valueProp }) === JSON.stringify({ v: valueRef.current })) {
      return;
    }
    handleOnChange(valueProp);
  }, [valueProp]);

  const dropdown = (
    <SUIDropdown
      allowAdditions={allowAdd}
      className={dropdownClassName}
      button={isButton}
      compact={isButton}
      disabled={isDisabled}
      error={isError}
      floating={isButton}
      multiple={isMultiple}
      onAddItem={_onAdd}
      onBlur={onBlur}
      onChange={_onChange}
      onClose={onClose}
      options={options}
      placeholder={placeholder}
      renderLabel={renderLabel}
      search={onSearch || allowAdd}
      searchInput={searchInput}
      selection
      value={valueRef.current}
    />
  );

  return isButton
    ? (
      <SUIButton.Group primary>
        {dropdown}
      </SUIButton.Group>
    )
    : (
      <Labelled
        className={classes('ui--Dropdown', className)}
        help={help}
        label={label}
        labelExtra={labelExtra}
        style={style}
        withEllipsis={withEllipsis}
        withLabel={withLabel}
      >
        {dropdown}
      </Labelled>
    );
}

export default styled(Dropdown)`
  .ui--Dropdown-item {
    position: relative;
    white-space: nowrap;

    .ui--Dropdown-icon,
    .ui--Dropdown-name {
      display: inline-block;
    }

    .ui--Dropdown-icon {
      height: 32px;
      left: 0;
      position: absolute;
      top: -9px;
      width: 32px;
    }

    .ui--Dropdown-name {
      margin-left: 3rem;
    }
  }

  .ui.selection.dropdown {
    > .text > .ui--Dropdown-item {
      .ui--Dropdown-icon {
        left: -2.6rem;
        top: -1.15rem;
        opacity: 1;
      }

      .ui--Dropdown-name {
        margin-left: 0;
      }
    }
  }
`;
