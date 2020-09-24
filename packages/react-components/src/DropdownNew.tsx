// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import SUIDropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';
import { isUndefined } from '@polkadot/util';
import { Labelled } from '@polkadot/react-components';

interface Props<Option> {
  allowAdd?: boolean;
  className?: string;
  classNameButton?: string;
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

function BaseDropdown<Option> ({ allowAdd = false, className = '', classNameButton = '', defaultValue, dropdownClassName, help, isButton, isDisabled, isError, isFull, isMultiple, label, labelExtra, onAdd, onBlur, onChange, onClose, onSearch, options, placeholder, renderLabel, searchInput, transform, value, withEllipsis, withLabel }: Props<Option>): React.ReactElement<Props<Option>> {
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

  return (
    <div className={className}>
      {isButton
        ? <SUIButton.Group className={classNameButton}>{dropdown}</SUIButton.Group>
        : <Labelled
          className='ui--Dropdown'
          help={help}
          isFull={isFull}
          isOuter
          label={label}
          labelExtra={labelExtra}
          withEllipsis={withEllipsis}
          withLabel={withLabel}
        >
          {dropdown}
        </Labelled>

      }
    </div>
  );
}

const DropdownNew = React.memo(styled(BaseDropdown)`
  & .ui.selection.dropdown {
    display: flex;
    align-items: center;
    padding: 0.65rem 3rem 0.65rem 1.15rem;
    font-size: 1.15rem;
    line-height: 1.5rem;
    color: #000000;
    font-weight: 400;
    border: 1px solid #DFDFDF;

    .dropdown.icon {
      padding: 0 1.15rem;
    }
  }
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
  .seedDropdown {
    height: 100%;
    > .ui.selection.dropdown > .text {
      white-space: nowrap;
    }
  }
`) as unknown as IDropdown<any>;

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
(DropdownNew as any).Header = SUIDropdown.Header;

export default DropdownNew;
