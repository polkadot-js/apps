// Copyright 2017-2025 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';
import type { DeriveAccountRegistration } from '@polkadot/api-derive/types';
import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React, { useCallback, useContext, useEffect, useState } from 'react';

import { statics } from '@polkadot/react-api/statics';
import { useApi, useDeriveAccountInfo } from '@polkadot/react-hooks';
import { AccountSidebarCtx } from '@polkadot/react-hooks/ctx/AccountSidebar';
import { formatNumber, isCodec, isFunction, isU8a, stringToU8a, u8aEmpty, u8aEq, u8aToBn } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import { getAddressName } from './util/index.js';
import Badge from './Badge.js';
import { styled } from './styled.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  defaultName?: string;
  label?: React.ReactNode;
  onClick?: () => void;
  override?: React.ReactNode;
  // this is used by app-account/addresses to toggle editing
  toggle?: unknown;
  value: AccountId | AccountIndex | Address | string | Uint8Array | null | undefined;
  withSidebar?: boolean;
}

type AddrMatcher = (addr: unknown) => string | null;

function createAllMatcher (prefix: string, name: string): AddrMatcher {
  const test = statics.registry.createType('AccountId', stringToU8a(prefix.padEnd(32, '\0')));

  return (addr: unknown) =>
    test.eq(addr)
      ? name
      : null;
}

function createNumMatcher (prefix: string, name: string, add?: string): AddrMatcher {
  const test = stringToU8a(prefix);

  // 4 bytes for u32 (more should not hurt, LE)
  const minLength = test.length + 4;

  return (addr: unknown): string | null => {
    try {
      const decoded = isU8a(addr) ? addr : isCodec(addr) ? addr.toU8a() : decodeAddress(addr?.toString() || '');
      const type = decoded.length === 20 ? 'AccountId20' : 'AccountId';
      const u8a = statics.registry.createType(type, decoded).toU8a();

      return (u8a.length >= minLength) && u8aEq(test, u8a.subarray(0, test.length)) && u8aEmpty(u8a.subarray(minLength))
        ? `${name} ${formatNumber(u8aToBn(u8a.subarray(test.length, minLength)))}${add ? ` (${add})` : ''}`
        : null;
    } catch (e) {
      console.log(e);

      return null;
    }
  };
}

export const MATCHERS: AddrMatcher[] = [
  createAllMatcher('modlpy/socie', 'Society'),
  createAllMatcher('modlpy/trsry', 'Treasury'),
  createAllMatcher('modlpy/xcmch', 'XCM'),
  createNumMatcher('modlpy/cfund', 'Crowdloan'),
  // Substrate master
  createNumMatcher('modlpy/npols\x00', 'Pool', 'Stash'),
  createNumMatcher('modlpy/npols\x01', 'Pool', 'Reward'),
  // Westend
  createNumMatcher('modlpy/nopls\x00', 'Pool', 'Stash'),
  createNumMatcher('modlpy/nopls\x01', 'Pool', 'Reward'),
  createNumMatcher('para', 'Child'),
  createNumMatcher('sibl', 'Sibling')
];

const displayCache = new Map<string, React.ReactNode>();
const indexCache = new Map<string, string>();
const parentCache = new Map<string, string>();

export function getParentAccount (value: string): string | undefined {
  return parentCache.get(value);
}

function defaultOrAddr (defaultName = '', _address: AccountId | AccountIndex | Address | string | Uint8Array, _accountIndex?: AccountIndex | null): [displayName: React.ReactNode, isLocal: boolean, isAddress: boolean, isSpecial: boolean] {
  let known: string | null = null;

  for (let i = 0; known === null && i < MATCHERS.length; i++) {
    known = MATCHERS[i](_address);
  }

  if (known) {
    return [known, false, false, true];
  }

  const accountId = _address.toString();

  if (!accountId) {
    return [defaultName, false, false, false];
  }

  const [isAddressExtracted, , extracted] = getAddressName(accountId, null, defaultName);
  const accountIndex = (_accountIndex || '').toString() || indexCache.get(accountId);

  if (isAddressExtracted && accountIndex) {
    indexCache.set(accountId, accountIndex);

    return [accountIndex, false, true, false];
  }

  return [extracted, !isAddressExtracted, isAddressExtracted, false];
}

function defaultOrAddrNode (defaultName = '', address: AccountId | AccountIndex | Address | string | Uint8Array, accountIndex?: AccountIndex | null): React.ReactNode {
  const [node, , isAddress] = defaultOrAddr(defaultName, address, accountIndex);

  return isAddress
    ? <span className='isAddress'>{node}</span>
    : node;
}

function extractName (address: string, accountIndex?: AccountIndex, defaultName?: string): React.ReactNode {
  const displayCached = displayCache.get(address);

  if (displayCached) {
    return displayCached;
  }

  const [displayName, isLocal, isAddress, isSpecial] = defaultOrAddr(defaultName, address, accountIndex);

  return (
    <span className='via-identity'>
      {isSpecial && (
        <Badge
          color='green'
          icon='archway'
          isSmall
        />
      )}
      <span className={`name${(isLocal || isSpecial) ? ' isLocal' : (isAddress ? ' isAddress' : '')}`}>{displayName}</span>
    </span>
  );
}

function createIdElem (nameElem: React.ReactNode, color: 'green' | 'red' | 'gray', icon: IconName): React.ReactNode {
  return (
    <span className='via-identity'>
      <Badge
        color={color}
        icon={icon}
        isSmall
      />
      {nameElem}
    </span>
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
    <span className={`name${isGood && !isBad ? ' isGood' : ''}`}>
      <span className='top'>{displayParent || displayName}</span>
      {displayParent && <span className='sub'>{`/${displayName || ''}`}</span>}
    </span>,
    (isBad ? 'red' : (isGood ? 'green' : 'gray')),
    identity.parent ? 'link' : (isGood && !isBad ? 'check' : 'minus')
  );

  displayCache.set(address, elem);

  return elem;
}

function AccountName ({ children, className = '', defaultName, label, onClick, override, toggle, value, withSidebar }: Props): React.ReactElement<Props> {
  const { apiIdentity } = useApi();
  const info = useDeriveAccountInfo(value);
  const [name, setName] = useState<React.ReactNode>(() => extractName((value || '').toString(), undefined, defaultName));
  const toggleSidebar = useContext(AccountSidebarCtx);

  // set the actual nickname, local name, accountIndex, accountId
  useEffect((): void => {
    const { accountId, accountIndex, identity, nickname } = info || {};
    const cacheAddr = (accountId || value || '').toString();

    if (identity?.parent) {
      parentCache.set(cacheAddr, identity.parent.toString());
    }

    if (apiIdentity && isFunction(apiIdentity.query.identity?.identityOf)) {
      setName(() =>
        identity?.display
          ? extractIdentity(cacheAddr, identity)
          : extractName(cacheAddr, accountIndex)
      );
    } else if (nickname) {
      setName(nickname);
    } else {
      setName(defaultOrAddrNode(defaultName, cacheAddr, accountIndex));
    }
  }, [apiIdentity, defaultName, info, toggle, value]);

  const _onNameEdit = useCallback(
    () => setName(defaultOrAddrNode(defaultName, (value || '').toString())),
    [defaultName, value]
  );

  const _onToggleSidebar = useCallback(
    () => toggleSidebar && value && toggleSidebar([value.toString(), _onNameEdit]),
    [_onNameEdit, toggleSidebar, value]
  );

  return (
    <StyledSpan
      className={`${className}  ui--AccountName ${withSidebar ? 'withSidebar' : ''}`}
      data-testid='account-name'
      onClick={
        withSidebar
          ? _onToggleSidebar
          : onClick
      }
    >
      {label || ''}{override || name}{children}
    </StyledSpan>
  );
}

const StyledSpan = styled.span`
  border: 1px dotted transparent;
  line-height: 1;
  vertical-align: middle;
  white-space: nowrap;

  &.withSidebar:hover {
    border-bottom-color: #333;
    cursor: help !important;
  }

  .isAddress {
    display: inline-block;
    min-width: var(--width-shortaddr);
    max-width: var(--width-shortaddr);
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: none;
    white-space: nowrap;
  }

  .via-identity {
    word-break: break-all;

    .name {
      font-weight: var(--font-weight-normal) !important;
      filter: grayscale(100%);
      line-height: 1;
      overflow: hidden;
      text-overflow: ellipsis;

      &:not(.isAddress) {
        text-transform: uppercase;
      }

      &.isAddress {
        opacity: var(--opacity-light);
      }

      .sub,
      .top {
        vertical-align: middle;
      }

      .sub {
        font-size: var(--font-size-tiny);
        opacity: var(--opacity-light);
      }
    }
  }
`;

export default React.memo(AccountName);
