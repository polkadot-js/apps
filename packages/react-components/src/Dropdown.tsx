// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DropdownItemProps, DropdownProps, StrictDropdownProps } from 'semantic-ui-react';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button as SUIButton, Dropdown as SUIDropdown } from 'semantic-ui-react';

import { isUndefined } from '@polkadot/util';

import Labelled from './Labelled.js';
import { styled } from './styled.js';

interface Props<Option extends DropdownItemProps> {
  allowAdd?: boolean;
  children?: React.ReactNode;
  className?: string;
  defaultValue?: any;
  dropdownClassName?: string;
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
  onSearch?: StrictDropdownProps['search'];
  options: (React.ReactNode | Option)[];
  placeholder?: string;
  renderLabel?: (item: any) => any;
  searchInput?: { autoFocus: boolean };
  tabIndex?: number;
  transform?: (value: any) => any;
  value?: unknown;
  withEllipsis?: boolean;
  withLabel?: boolean;
}

export type IDropdown<Option extends DropdownItemProps> = React.ComponentType<Props<Option>> & {
  Header: React.ComponentType<{ content: React.ReactNode }>;
}

function DropdownBase<Option extends DropdownItemProps> ({ allowAdd = false, children, className = '', defaultValue, dropdownClassName, isButton, isDisabled, isError, isFull, isMultiple, label, labelExtra, onAdd, onBlur, onChange, onClose, onSearch, options, placeholder, renderLabel, searchInput, tabIndex, transform, value, withEllipsis, withLabel }: Props<Option>): React.ReactElement<Props<Option>> {
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
    _setStored((isUndefined(value) ? defaultValue : value) as string);
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
      // NOTE This is not quite correct since we also pass React.ReactNode items
      // through (e.g. these are used as headers, see InputAddress). But... it works...
      options={options as Option[]}
      placeholder={placeholder}
      renderLabel={renderLabel}
      search={onSearch || allowAdd}
      searchInput={searchInput}
      selection
      tabIndex={tabIndex}
      value={stored}
    />
  );

  return isButton
    ? <SUIButton.Group>{dropdown}{children}</SUIButton.Group>
    : (
      <StyledLabelled
        className={`${className} ui--Dropdown`}
        isFull={isFull}
        label={label}
        labelExtra={labelExtra}
        withEllipsis={withEllipsis}
        withLabel={withLabel}
      >
        {dropdown}
        {children}
      </StyledLabelled>
    );
}

const StyledLabelled = styled(Labelled)`
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

      &.opaque {
        opacity: var(--opacity-light);
      }
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

const Dropdown = React.memo(DropdownBase) as unknown as typeof DropdownBase & {
  Header: typeof SUIDropdown.Header
};

Dropdown.Header = SUIDropdown.Header;

export default Dropdown;
