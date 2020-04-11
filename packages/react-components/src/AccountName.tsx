// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo, DeriveAccountRegistration } from '@polkadot/api-derive/types';
import { BareProps } from '@polkadot/react-api/types';
import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import registry from '@polkadot/react-api/typeRegistry';
import { useCall, useApi, useRegistrars, useToggle } from '@polkadot/react-hooks';
import { stringToU8a } from '@polkadot/util';

import { useTranslation } from './translate';
import { getAddressName } from './util';
import AccountNameJudgement from './AccountNameJudgement';
import AddressMini from './AddressMini';
import Badge from './Badge';
import Icon from './Icon';

interface Props extends BareProps {
  children?: React.ReactNode;
  defaultName?: string;
  label?: React.ReactNode;
  noName?: boolean;
  onClick?: () => void;
  override?: React.ReactNode;
  // this is used by app-account/addresses to toggle editing
  toggle?: boolean;
  value: AccountId | AccountIndex | Address | string | Uint8Array | null | undefined;
}

const KNOWN: [AccountId, string][] = [
  [registry.createType('AccountId', stringToU8a('modlpy/socie'.padEnd(32, '\0'))), 'Society'],
  [registry.createType('AccountId', stringToU8a('modlpy/trsry'.padEnd(32, '\0'))), 'Treasury']
];

const DISPLAY_KEYS = ['display', 'legal', 'email', 'web', 'twitter', 'riot'];
const nameCache: Map<string, [boolean, [React.ReactNode, React.ReactNode | null]]> = new Map();

function defaultOrAddr (defaultName = '', _address: AccountId | AccountIndex | Address | string | Uint8Array, _accountIndex?: AccountIndex | null): [[React.ReactNode, React.ReactNode | null], boolean, boolean, boolean] {
  const known = KNOWN.find(([known]) => known.eq(_address));

  if (known) {
    return [[known[1], null], false, false, true];
  }

  const accountId = _address.toString();
  const accountIndex = (_accountIndex || '').toString();

  if (!accountId) {
    return [[defaultName, null], false, false, false];
  }

  const [isAddressExtracted,, extracted] = getAddressName(accountId, null, defaultName);
  const [isAddressCached, nameCached] = nameCache.get(accountId) || [false, [null, null]];

  if (extracted && isAddressCached && !isAddressExtracted) {
    // skip, default return
  } else if (nameCached[0]) {
    return [nameCached, false, isAddressCached, false];
  } else if (isAddressExtracted && accountIndex) {
    nameCache.set(accountId, [true, [accountIndex, null]]);

    return [[accountIndex, null], false, true, false];
  }

  return [[extracted, null], !isAddressExtracted, isAddressExtracted, false];
}

function extractName (address: string, accountIndex?: AccountIndex, defaultName?: string): React.ReactNode {
  const [[displayFirst, displaySecond], isLocal, isAddress, isSpecial] = defaultOrAddr(defaultName, address, accountIndex);

  return (
    <div className='via-identity'>
      {isSpecial && (
        <Badge
          info={<Icon name='simplybuilt' />}
          isInline
          isSmall
          type='green'
        />
      )}
      <span className={`name ${(isLocal || isSpecial) ? 'isLocal' : (isAddress ? 'isAddress' : '')}`}>{
        displaySecond
          ? <><span className='top'>{displayFirst}</span><span className='sub'>/{displaySecond}</span></>
          : displayFirst
      }</span>
    </div>
  );
}

function extractIdentity (address: string, identity: DeriveAccountRegistration, onJudge: undefined | (() => void), t: (key: string, opts?: object) => string): React.ReactNode {
  const judgements = identity.judgements.filter(([, judgement]): boolean => !judgement.isFeePaid);
  const isGood = judgements.some(([, judgement]): boolean => judgement.isKnownGood || judgement.isReasonable);
  const isBad = judgements.some(([, judgement]): boolean => judgement.isErroneous || judgement.isLowQuality);
  const waitCount = identity.judgements.length - judgements.length;
  const hover = (
    <div>
      <div>
        {
          judgements.length
            ? (judgements.length === 1
              ? t('1 judgement')
              : t('{{count}} judgements', { replace: { count: judgements.length } })
            )
            : t('no judgements')
        }{judgements.length ? ': ' : ''}{judgements.map(([, judgement]): string => judgement.toString()).join(', ')}{
          waitCount
            ? t(' ({{count}} waiting)', { replace: { count: waitCount } })
            : ''
        }
      </div>
      <table>
        <tbody>
          {identity.parent && (
            <tr>
              <td>{t('parent')}</td>
              <td><AddressMini value={identity.parent} /></td>
            </tr>
          )}
          {DISPLAY_KEYS
            .filter((key): boolean => !!identity[key as 'web'])
            .map((key): React.ReactNode => (
              <tr key={key}>
                <td>{t(key)}</td>
                <td>{identity[key as 'web']}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );

  const displayName = isGood
    ? identity.display
    : (identity.display || '').replace(/[^\x20-\x7E]/g, '');
  const displayParent = identity.displayParent
    ? (
      isGood
        ? identity.displayParent
        : identity.displayParent.replace(/[^\x20-\x7E]/g, '')
    )
    : undefined;

  nameCache.set(address, [false, displayParent ? [displayParent, displayName] : [displayName, null]]);

  return (
    <div className='via-identity'>
      <Badge
        hover={hover}
        info={<Icon name={identity.parent ? 'caret square up outline' : (isGood ? 'check' : 'minus')} />}
        isInline
        isSmall
        isTooltip
        onClick={onJudge}
        type={
          isGood
            ? 'green'
            : isBad
              ? 'brown'
              : 'gray'
        }
      />
      {
        displayParent
          ? <span className={`name ${isGood && 'isGood'}`}><span className='top'>{displayParent}</span><span className='sub'>/{displayName}</span></span>
          : <span className={`name ${isGood && 'isGood'}`}>{displayName}</span>
      }
    </div>
  );
}

function AccountName ({ children, className, defaultName, label, noName, onClick, override, toggle, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isRegistrar, registrars } = useRegistrars(noName);
  const [isJudgementOpen, toggleJudgement] = useToggle();
  const info = useCall<DeriveAccountInfo>(!noName && api.derive.accounts.info, [value]);
  const [name, setName] = useState<React.ReactNode>(() => extractName((value || '').toString(), undefined, defaultName));

  // set the actual nickname, local name, accountIndex, accountId
  useEffect((): void => {
    const { accountId, accountIndex, identity, nickname } = info || {};
    const cacheAddr = (accountId || value || '').toString();

    if (api.query.identity?.identityOf) {
      setName((): React.ReactNode =>
        identity?.display
          ? extractIdentity(cacheAddr, identity, isRegistrar ? toggleJudgement : undefined, t)
          : extractName(cacheAddr, accountIndex)
      );
    } else if (nickname) {
      nameCache.set(cacheAddr, [false, [nickname, null]]);

      setName(nickname);
    } else {
      setName(defaultOrAddr(defaultName, cacheAddr, accountIndex));
    }
  }, [api, defaultName, info, isRegistrar, t, toggle, toggleJudgement, value]);

  return (
    <>
      {isJudgementOpen && (
        <AccountNameJudgement
          address={(value || '').toString()}
          registrars={registrars}
          toggleJudgement={toggleJudgement}
        />
      )}
      <div
        className={`ui--AccountName ${className}`}
        onClick={
          override
            ? undefined
            : onClick
        }
      >
        {label || ''}{override || name}{children}
      </div>
    </>
  );
}

export default React.memo(styled(AccountName)`
  .via-identity {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: bottom;
    width: 100%;

    .name {
      font-weight: normal !important;
      filter: grayscale(100%);
      opacity: 0.6;
      text-transform: uppercase;

      &.isAddress {
        font-family: monospace;
        text-transform: none;
      }

      &.isGood,
      &.isLocal {
        opacity: 1;
      }

      .sub {
        font-size: 0.75rem;
        opacity: 0.75;
      }
    }

    div.name {
      display: inline-block;
    }

    > * {
      line-height: 1em;
      vertical-align: middle;
    }
  }
`);
