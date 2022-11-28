// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';

import { useAccountInfo } from '@polkadot/react-hooks';
import BaseIdentityIcon from '@polkadot/react-identicon';

import IdentityIcon from './IdentityIcon';
import Row, { RowProps } from './Row';
import { toShortAddress } from './util';

export interface Props extends RowProps {
  isContract?: boolean;
  isValid?: boolean;
  fullLength?: boolean;
  label?: string;
  noDefaultNameOpacity?: boolean;
  overlay?: React.ReactNode;
  value: AccountId | AccountIndex | Address | string;
  withSidebar?: boolean;
  withTags?: boolean;
}

const DEFAULT_ADDR = '5'.padEnd(48, 'x');
const ICON_SIZE = 32;

function AddressRow ({ buttons, children, className, defaultName, fullLength = false, isContract = false, isDisabled, isEditableName, isInline, isValid: propsIsValid, overlay, value, withTags = false }: Props): React.ReactElement<Props> | null {
  const { accountIndex, isNull, name, onSaveName, onSaveTags, setName, setTags, tags } = useAccountInfo(value ? value.toString() : null, isContract);

  const isValid = !isNull && (propsIsValid || value || accountIndex);
  const Icon = value ? IdentityIcon : BaseIdentityIcon;
  const address = value && isValid ? value : DEFAULT_ADDR;

  return (
    <Row
      address={fullLength ? address : toShortAddress(address)}
      buttons={buttons}
      className={className}
      defaultName={defaultName}
      icon={
        <Icon
          size={ICON_SIZE}
          value={value ? value.toString() : null}
        />
      }
      isDisabled={isDisabled}
      isEditableName={isEditableName}
      isEditableTags
      isInline={isInline}
      name={name}
      onChangeName={setName}
      onChangeTags={setTags}
      onSaveName={onSaveName}
      onSaveTags={onSaveTags}
      tags={withTags && tags}
    >
      {children}
      {overlay}
    </Row>
  );
}

export {
  DEFAULT_ADDR,
  AddressRow
};

export default React.memo(styled(AddressRow)`
  button.u.ui--Icon.editButton {
    padding: 0 .3em .3em .3em;
    color: #2e86ab;
    background: none;
    /*trick to let the button in the flow but keep the content centered regardless*/
    margin-left: -2em;
    position: relative;
    right: -2.3em;
    z-index: 1;
  }

  .editSpan {
    white-space: nowrap;

    &:before {
      content: '';
    }
  }

  .ui--AddressRow-balances {
    display: flex;
    .column {
      display: block;

      label,
      .result {
        display: inline-block;
        vertical-align: middle;
      }
    }

    > span {
      text-align: left;
    }
  }

  .ui--AddressRow-placeholder {
    opacity: 0.5;
  }
`);
