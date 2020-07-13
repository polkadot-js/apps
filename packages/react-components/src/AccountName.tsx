// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IconName } from '@fortawesome/fontawesome-svg-core';
import { DeriveAccountInfo, DeriveAccountRegistration } from '@polkadot/api-derive/types';
import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import registry from '@polkadot/react-api/typeRegistry';
import { AccountSidebarToggle } from '@polkadot/app-accounts/Sidebar';
import { useCall, useApi } from '@polkadot/react-hooks';
import { isFunction, stringToU8a } from '@polkadot/util';

import { getAddressName } from './util';
import Badge from './Badge';

interface Props {
  children?: React.ReactNode;
  className?: string;
  defaultName?: string;
  label?: React.ReactNode;
  noLookup?: boolean;
  onClick?: () => void;
  override?: React.ReactNode;
  // this is used by app-account/addresses to toggle editing
  toggle?: boolean;
  value: AccountId | AccountIndex | Address | string | Uint8Array | null | undefined;
  withSidebar?: boolean;
}

const KNOWN: [AccountId, string][] = [
  [registry.createType('AccountId', stringToU8a('modlpy/socie'.padEnd(32, '\0'))), 'Society'],
  [registry.createType('AccountId', stringToU8a('modlpy/trsry'.padEnd(32, '\0'))), 'Treasury']
];

const displayCache = new Map<string, React.ReactNode>();
const indexCache = new Map<string, string>();

function defaultOrAddr (defaultName = '', _address: AccountId | AccountIndex | Address | string | Uint8Array, _accountIndex?: AccountIndex | null): [React.ReactNode, boolean, boolean, boolean] {
  const known = KNOWN.find(([known]) => known.eq(_address));

  if (known) {
    return [known[1], false, false, true];
  }

  const accountId = _address.toString();

  if (!accountId) {
    return [defaultName, false, false, false];
  }

  const [isAddressExtracted,, extracted] = getAddressName(accountId, null, defaultName);
  const accountIndex = (_accountIndex || '').toString() || indexCache.get(accountId);

  if (isAddressExtracted && accountIndex) {
    indexCache.set(accountId, accountIndex);

    return [accountIndex, false, true, false];
  }

  return [extracted, !isAddressExtracted, isAddressExtracted, false];
}

function extractName (address: string, accountIndex?: AccountIndex, defaultName?: string): React.ReactNode {
  const displayCached = displayCache.get(address);

  if (displayCached) {
    return displayCached;
  }

  const [displayName, isLocal, isAddress, isSpecial] = defaultOrAddr(defaultName, address, accountIndex);

  return (
    <div className='via-identity'>
      {isSpecial && (
        <Badge
          color='green'
          icon='archway'
          isSmall
        />
      )}
      <span className={`name${(isLocal || isSpecial) ? ' isLocal' : (isAddress ? ' isAddress' : '')}`}>{displayName}</span>
    </div>
  );
}

function createIdElem (nameElem: React.ReactNode, color: 'green' | 'red' | 'gray', icon: IconName): React.ReactNode {
  return (
    <div className='via-identity'>
      <Badge
        color={color}
        icon={icon}
        isSmall
      />
      {nameElem}
    </div>
  );
}

function extractIdentity (address: string, identity: DeriveAccountRegistration): React.ReactNode {
  const judgements = identity.judgements.filter(([, judgement]) => !judgement.isFeePaid);
  const isGood = judgements.some(([, judgement]) => judgement.isKnownGood || judgement.isReasonable);
  const isBad = judgements.some(([, judgement]) => judgement.isErroneous || judgement.isLowQuality);
  const displayName = isGood
    ? identity.display
    : (identity.display || '').replace(/[^\x20-\x7E]/g, '');
  const displayParent = identity.displayParent && (
    isGood
      ? identity.displayParent
      : identity.displayParent.replace(/[^\x20-\x7E]/g, '')
  );
  const elem = createIdElem(
    <span className={`name${isGood ? ' isGood' : ''}`}>
      <span className='top'>{displayParent || displayName}</span>
      {displayParent && <span className='sub'>{`/${displayName || ''}`}</span>}
    </span>,
    isGood ? 'green' : (isBad ? 'red' : 'gray'),
    identity.parent ? 'link' : (isGood ? 'check' : 'minus')
  );

  displayCache.set(address, elem);

  return elem;
}

function AccountName ({ children, className = '', defaultName, label, noLookup, onClick, override, toggle, value, withSidebar }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const info = useCall<DeriveAccountInfo>(!noLookup && api.derive.accounts.info, [value]);
  const [name, setName] = useState<React.ReactNode>(() => extractName((value || '').toString(), undefined, defaultName));
  const toggleSidebar = useContext(AccountSidebarToggle);

  // set the actual nickname, local name, accountIndex, accountId
  useEffect((): void => {
    const { accountId, accountIndex, identity, nickname } = info || {};
    const cacheAddr = (accountId || value || '').toString();

    if (isFunction(api.query.identity?.identityOf)) {
      setName(() =>
        identity?.display
          ? extractIdentity(cacheAddr, identity)
          : extractName(cacheAddr, accountIndex)
      );
    } else if (nickname) {
      setName(nickname);
    } else {
      setName(defaultOrAddr(defaultName, cacheAddr, accountIndex));
    }
  }, [api, defaultName, info, toggle, value]);

  const _onNameEdit = useCallback(
    () => setName(defaultOrAddr(defaultName, (value || '').toString())),
    [defaultName, value]
  );

  const _onToggleSidebar = useCallback(
    () => toggleSidebar && value && toggleSidebar([value.toString(), _onNameEdit]),
    [_onNameEdit, toggleSidebar, value]
  );

  return (
    <div
      className={`ui--AccountName${withSidebar ? ' withSidebar' : ''} ${className}`}
      onClick={
        withSidebar
          ? _onToggleSidebar
          : onClick
      }
    >
      {label || ''}{override || name}{children}
    </div>
  );
}

export default React.memo(styled(AccountName)`
  border: 1px dotted transparent;
  vertical-align: middle;
  white-space: nowrap;

  &.withSidebar:hover {
    border-bottom-color: #333;
    cursor: help !important;
  }

  .via-identity {
    align-items: end;
    display: inline-flex;
    width: 100%;

    .name {
      font-weight: normal !important;
      filter: grayscale(100%);
      line-height: 1;
      opacity: 0.6;
      overflow: hidden;
      text-overflow: ellipsis;

      &:not(.isAddress) {
        text-transform: uppercase;
      }

      &.isAddress {
        font-family: monospace;
        text-transform: none;
      }

      &.isGood,
      &.isLocal {
        opacity: 1;
      }

      .sub,
      .top {
        vertical-align: middle;
      }

      .sub {
        font-size: 0.75rem;
        opacity: 0.75;
      }
    }
  }
`);
