// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Address } from '@polkadot/types/interfaces';

import React, { useCallback } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { useQueue } from '@polkadot/react-hooks';

import AzeroId, { AZERO_ID_ROW_HEIGHT } from './AzeroId/index.js';
import IdentityIcon from './IdentityIcon/index.js';
import AccountName from './AccountName.js';
import Icon from './Icon.js';
import ParentAccount from './ParentAccount.js';
import { styled } from './styled.js';
import { useTranslation } from './translate.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  defaultName?: string;
  isAzeroIdShown?: boolean;
  isParentAddressShown?: boolean;
  isRegisterLinkShown?: boolean;
  onClickName?: () => void;
  overrideName?: React.ReactNode;
  parentAddress?: string;
  withSidebar?: boolean;
  withShortAddress?: boolean;
  toggle?: unknown;
  value?: string | Address | AccountId | null | Uint8Array;
}

function AddressSmall ({ children,
  className = '',
  defaultName,
  isAzeroIdShown = false,
  isParentAddressShown = false,
  isRegisterLinkShown = false,
  onClickName,
  overrideName,
  parentAddress,
  toggle,
  value,
  withShortAddress = false,
  withSidebar = true }: Props): React.ReactElement<Props> {
  const { queueAction } = useQueue();
  const { t } = useTranslation();

  const onCopy = useCallback(
    (address: string) => queueAction({
      account: address,
      action: t<string>('clipboard'),
      message: t<string>('account address copied'),
      status: 'queued'
    }),
    [queueAction, t]
  );

  return (
    <Container
      className={className}
    >
      {isParentAddressShown && (
        <div className='parentName'>
          {parentAddress && (
            <StyledParentAccount
              address={parentAddress}
            />
          )}
        </div>
      )}
      <StyledIdentityIcon
        className='identityIcon'
        value={value as Uint8Array}
      />
      <StyleAccountName
        className={`accountName ${withSidebar ? 'withSidebar' : ''}`}
        defaultName={defaultName}
        onClick={onClickName}
        override={overrideName}
        toggle={toggle}
        value={value}
        withSidebar={withSidebar}
      >
        {children}
      </StyleAccountName>
      {withShortAddress && (
        <CopyToClipboard
          onCopy={onCopy}
          text={value?.toString() || ''}
        >
          <AddressContainer className='shortAddress'>
            <ShortAddress
              data-testid='short-address'
            >
              {value?.toString()}
            </ShortAddress>
            <SmallIcon
              icon='copy'
            />
          </AddressContainer>
        </CopyToClipboard>
      )}
      {isAzeroIdShown && (
        <div className='azeroIdDomain'>
          <AzeroId
            address={value?.toString()}
            isRegisterLinkShown={isRegisterLinkShown}
          />
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  padding-block: 0.75rem;

  display: grid;
  grid-template-columns: max-content 1fr;
  grid-template-areas:
    "     .        parentName  "
    "identityIcon  accountName "
    "     .       shortAddress "
    "     .       azeroIdDomain";

  align-items: center;
  column-gap: 0.5rem;

  .parentName {
    grid-area: parentName;
    height: 18px;
  }

  .identityIcon {
    grid-area: identityIcon;
  }

  .accountName {
    grid-area: accountName;
  }

  .shortAddress {
    grid-area: shortAddress;
    height: 18px;
  }

  .azeroIdDomain {
    grid-area: azeroIdDomain;
    height: ${AZERO_ID_ROW_HEIGHT};
  }
`;

const StyledParentAccount = styled(ParentAccount)`
  font-size: var(--font-size-small);
`;

const StyledIdentityIcon = styled(IdentityIcon)`
  width: 26px;
  height: 26px;
  flex-shrink: 0;
`;

const StyleAccountName = styled(AccountName)`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AddressContainer = styled.button`
  display: flex;
  align-items: center;

  justify-self: start;

  background-color: inherit;
  color: inherit;
  padding: 0;
  border: unset;

  cursor: copy;

  margin-bottom: 0.25rem;
  color: #8B8B8B;
`;

const ShortAddress = styled.p`
  margin: 0;

  font-size: var(--font-size-small);

  display: inline-block;
  width: var(--width-shortaddr);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SmallIcon = styled(Icon)`
  width: 10px;
  height: 10px;
`;

export default React.memo(AddressSmall);
