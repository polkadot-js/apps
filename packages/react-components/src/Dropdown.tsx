// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import SUIDropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';
import { isUndefined } from '@polkadot/util';

import { classes } from './util';
import Labelled from './Labelled';

interface Props<Option> {
  allowAdd?: boolean;
  className?: string;
  defaultValue?: any;
  dropdownClassName?: string;
  help?: React.ReactNode;
  isButton?: boolean;
  isDisabled?: boolean;
  isError?: boolean;
  isFull?: boolean;
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

export type IDropdown<Option> = React.ComponentType<Props<Option>> & {
  Header: React.ComponentType<{ content: React.ReactNode }>;
}

function BaseDropdown<Option> ({ allowAdd = false, className = '', defaultValue, dropdownClassName, help, isButton, isDisabled, isError, isFull, isMultiple, label, labelExtra, onAdd, onBlur, onChange, onClose, onSearch, options, placeholder, renderLabel, searchInput, transform, value, withEllipsis, withLabel }: Props<Option>): React.ReactElement<Props<Option>> {
  const lastUpdate = useRef<string>('');
  const [stored, setStored] = useState<string | undefined>();

  const _setStored = useCallback(
    (value: string): void => {
      const json = JSON.stringify({ v: value });

      if (lastUpdate.current !== json) {
        lastUpdate.current = json;

        setStored(value);

        onChange && onChange(
          transform
            ? transform(value)
            : value
        );
      }
    },
    [onChange, transform]
  );

  useEffect((): void => {
    _setStored(isUndefined(value) ? defaultValue : value);
  }, [_setStored, defaultValue, value]);

  const _onAdd = useCallback(
    (_: React.SyntheticEvent<HTMLElement>, { value }: DropdownProps): void =>
      onAdd && onAdd(value),
    [onAdd]
  );

  const _onChange = useCallback(
    (_: React.SyntheticEvent<HTMLElement> | null, { value }: DropdownProps): void =>
      _setStored(value as string),
    [_setStored]
  );

  const dropdown = (
    <SUIDropdown
      allowAdditions={allowAdd}
      button={isButton}
      className={dropdownClassName}
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
      value={stored}
    />
  );

  return isButton
    ? <SUIButton.Group>{dropdown}</SUIButton.Group>
    : (
      <Labelled
        className={classes('ui--Dropdown', className)}
        help={help}
        isFull={isFull}
        label={label}
        labelExtra={labelExtra}
        withEllipsis={withEllipsis}
        withLabel={withLabel}
      >
        {dropdown}
      </Labelled>
    );
}

const Dropdown = React.memo(styled(BaseDropdown)`
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
`) as unknown as IDropdown<any>;

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
(Dropdown as any).Header = SUIDropdown.Header;

export default Dropdown;
