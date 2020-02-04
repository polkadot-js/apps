// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { BareProps } from '@polkadot/react-api/types';
import { AccountId, AccountIndex, Address, RegistrarInfo } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useCall, useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

import { useTranslation } from './translate';
import { getAddressName } from './util';
import AddressMini from './AddressMini';
import Badge from './Badge';
import Dropdown from './Dropdown';
import Icon from './Icon';
import Input from './Input';
import InputAddress from './InputAddress';
import Modal from './Modal';
import TxButton from './TxButton';

interface Props extends BareProps {
  children?: React.ReactNode;
  defaultName?: string;
  label?: React.ReactNode;
  onClick?: () => void;
  override?: React.ReactNode;
  toggle?: any;
  value?: AccountId | AccountIndex | Address | string | null | Uint8Array;
  withShort?: boolean;
}

const JUDGEMENT_ENUM = [
  { value: 0, text: 'Unknown' },
  { value: 1, text: 'Fee paid' },
  { value: 2, text: 'Reasonable' },
  { value: 3, text: 'Known good' },
  { value: 4, text: 'Out of date' },
  { value: 5, text: 'Low quality' }
];
const DISPLAY_KEYS = ['display', 'legal', 'email', 'web', 'twitter', 'riot'];
const nameCache: Map<string, [boolean, [React.ReactNode, React.ReactNode | null]]> = new Map();

function defaultOrAddr (defaultName = '', _address: AccountId | AccountIndex | Address | string | Uint8Array, _accountIndex?: AccountIndex | null): [[React.ReactNode, React.ReactNode | null], boolean, boolean] {
  const accountId = _address.toString();
  const accountIndex = (_accountIndex || '').toString();
  const [isAddressExtracted,, extracted] = getAddressName(accountId, null, defaultName);
  const [isAddressCached, nameCached] = nameCache.get(accountId) || [false, [null, null]];

  if (extracted && isAddressCached && !isAddressExtracted) {
    // skip, default return
  } else if (nameCached[0]) {
    return [nameCached, false, isAddressCached];
  } else if (isAddressExtracted && accountIndex) {
    nameCache.set(accountId, [true, [accountIndex, null]]);

    return [[accountIndex, null], false, true];
  }

  return [[extracted, null], !isAddressExtracted, isAddressExtracted];
}

function AccountName ({ children, className, defaultName, label, onClick, override, style, toggle, value, withShort }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [isJudgementOpen, toggleJudgement] = useToggle();
  const registrars = useCall<Option<RegistrarInfo>[]>(api.query.identity?.registrars, []);
  const info = useCall<DeriveAccountInfo>(api.derive.accounts.info as any, [value]);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isRegistrar, setIsRegistrar] = useState(false);
  const [judgementAccountId, setJudgementAccountId] = useState<string | null>(null);
  const [judgementEnum, setJudgementEnum] = useState(2); // Reasonable
  const [registrarIndex, setRegistrarIndex] = useState(-1);
  const address = useMemo((): string => (value || '').toString(), [value]);

  const _extractName = (accountId?: AccountId, accountIndex?: AccountIndex): React.ReactNode => {
    const [[displayFirst, displaySecond], isLocal, isAddress] = defaultOrAddr(defaultName, accountId || address, withShort ? null : accountIndex);

    return (
      <div className='via-identity'>
        <span className={`name ${isLocal ? 'isLocal' : (isAddress ? 'isAddress' : '')}`}>{
          displaySecond
            ? <><span className='top'>{displayFirst}</span><span className='sub'>/{displaySecond}</span></>
            : displayFirst
        }</span>
      </div>
    );
  };

  const [name, setName] = useState<React.ReactNode>((): React.ReactNode => _extractName());

  // determine if we have a registrar or not - registrars are allowed to approve
  useEffect((): void => {
    if (allAccounts && registrars) {
      setIsRegistrar(
        registrars
          .map((registrar): string| null =>
            registrar.isSome
              ? registrar.unwrap().account.toString()
              : null
          )
          .some((regId): boolean => !!regId && allAccounts.includes(regId))
      );
    }
  }, [allAccounts, registrars]);

  // find the id of our registrar in the list
  useEffect((): void => {
    if (registrars && judgementAccountId) {
      setRegistrarIndex(
        registrars
          .map((registrar): string| null =>
            registrar.isSome
              ? registrar.unwrap().account.toString()
              : null
          )
          .indexOf(judgementAccountId)
      );
    } else {
      setRegistrarIndex(-1);
    }
  }, [judgementAccountId, registrars]);

  // set the actual nickname, localname, accountIndex, accountId
  useEffect((): void => {
    const { accountId, accountIndex, identity, nickname } = info || {};

    if (accountId) {
      setAccountId(accountId.toString());
    }

    if (api.query.identity?.identityOf) {
      if (identity?.display) {
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
          : identity.display.replace(/[^\x20-\x7E]/g, '');
        const displayParent = identity.displayParent
          ? (
            isGood
              ? identity.displayParent
              : identity.displayParent.replace(/[^\x20-\x7E]/g, '')
          )
          : undefined;

        const name = (
          <div className='via-identity'>
            <Badge
              hover={hover}
              info={<Icon name={identity.parent ? 'caret square up outline' : (isGood ? 'check' : 'minus')} />}
              isInline
              isSmall
              isTooltip
              onClick={isRegistrar ? toggleJudgement : undefined}
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

        nameCache.set(address, [false, displayParent ? [displayParent, displayName] : [displayName, null]]);
        setName((): React.ReactNode => name);
      } else {
        setName((): React.ReactNode => _extractName(accountId, accountIndex));
      }
    } else if (nickname) {
      nameCache.set(address, [false, [nickname, null]]);
      setName(nickname);
    } else {
      setName(defaultOrAddr(defaultName, accountId || address, withShort ? null : accountIndex));
    }
  }, [info, toggle]);

  return (
    <>
      {isJudgementOpen && (
        <Modal
          header={t('Provide judgement')}
          size='small'
        >
          <Modal.Content>
            <InputAddress
              label={t('registrar account')}
              onChange={setJudgementAccountId}
            />
            <Input
              isDisabled
              label={t('registrar index')}
              value={registrarIndex === -1 ? t('invalid/unknown registrar account') : registrarIndex}
            />
            <Dropdown
              label={t('judgement')}
              onChange={setJudgementEnum}
              options={JUDGEMENT_ENUM}
              value={judgementEnum}
            />
          </Modal.Content>
          <Modal.Actions onCancel={toggleJudgement}>
            <TxButton
              accountId={judgementAccountId}
              icon='check'
              isDisabled={registrarIndex === -1}
              label={t('Judge')}
              onStart={toggleJudgement}
              params={[registrarIndex, accountId, judgementEnum]}
              tx='identity.provideJudgement'
            />
          </Modal.Actions>
        </Modal>
      )}
      <div
        className={`ui--AccountName ${className}`}
        onClick={
          override
            ? undefined
            : onClick
        }
        style={style}
      >
        {label || ''}{override || name}{children}
      </div>
    </>
  );
}

export default styled(AccountName)`
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

    .ui--Badge {
      margin-top: -2px;
    }
  }
`;
