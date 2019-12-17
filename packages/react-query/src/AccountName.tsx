// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { BareProps } from '@polkadot/react-api/types';
import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Badge, Icon } from '@polkadot/react-components';
import { getAddressName } from '@polkadot/react-components/util';
import { useCall, useApi } from '@polkadot/react-hooks';

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

const nameCache: Map<string, React.ReactNode> = new Map();

function defaultOrAddr (defaultName = '', _address: AccountId | AccountIndex | Address | string | Uint8Array, _accountIndex?: AccountIndex | null): [React.ReactNode, boolean] {
  const accountId = _address.toString();
  const cached = nameCache.get(accountId);

  if (cached) {
    return [cached, false];
  }

  const accountIndex = (_accountIndex || '').toString();
  const [isAddress,, extracted] = getAddressName(accountId, null, defaultName);

  if (isAddress && accountIndex) {
    nameCache.set(accountId, accountIndex);

    return [accountIndex, false];
  }

  return [extracted, !isAddress];
}

function AccountName ({ children, className, defaultName, label, onClick, override, style, toggle, value, withShort }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const info = useCall<DeriveAccountInfo>(api.derive.accounts.info as any, [value]);
  const address = useMemo((): string => (value || '').toString(), [value]);

  const _extractName = (accountId?: AccountId, accountIndex?: AccountIndex): React.ReactNode => {
    const [name, isLocal] = defaultOrAddr(defaultName, accountId || address, withShort ? null : accountIndex);

    return (
      <div className='via-identity'>
        <div className={`name ${isLocal ? '' : 'other'}`}>{name}</div>
      </div>
    );
  };

  const [name, setName] = useState<React.ReactNode>((): React.ReactNode => _extractName());

  useEffect((): void => {
    const { accountId, accountIndex, identity, nickname } = info || {};

    if (api.query.identity?.identityOf) {
      if (identity?.displayName) {
        const isGood = identity.judgements.some(([, judgement]): boolean => judgement.isKnownGood || judgement.isReasonable);
        const isBad = identity.judgements.some(([, judgement]): boolean => judgement.isErroneous || judgement.isLowQuality);

        // FIXME This needs to be i18n, with plurals
        const hover = (
          <div className='hover-identity'>
            <div className='header'>{`${identity.judgements.length ? identity.judgements.length : 'no'} judgement${identity.judgements.length === 1 ? '' : 's'}${identity.judgements.length ? ': ' : ''}${identity.judgements.map(([, judgement]): string => judgement.toString()).join(', ')}`}</div>
          </div>
        );

        const name = (
          <div className='via-identity'>
            <Badge
              hover={hover}
              info={<Icon name={isGood ? 'check' : 'minus'} />}
              isInline
              isSmall
              isTooltip
              type={
                isGood
                  ? 'green'
                  : isBad
                    ? 'brown'
                    : 'gray'
              }
            />
            <div className='name'>{identity.displayName.toUpperCase()}</div>
          </div>
        );

        nameCache.set(address, name);
        setName((): React.ReactNode => name);
      } else {
        setName((): React.ReactNode => _extractName(accountId, accountIndex));
      }
    } else if (nickname) {
      const name = nickname.toUpperCase();

      nameCache.set(address, name);
      setName(name);
    } else {
      setName(defaultOrAddr(defaultName, accountId || address, withShort ? null : accountIndex));
    }
  }, [info, toggle]);

  return (
    <div
      className={className}
      onClick={
        override
          ? undefined
          : onClick
      }
      style={style}
    >
      {label || ''}{override || name}{children}
    </div>
  );
}

export default styled(AccountName)`
  .hover-identity {
    div+div {
      margin-top: 0.75rem;
    }

    table {
      border: 0;

      td:first-child {
        padding-right: 0.25rem;
        text-align: right;
      }
    }
  }

  .via-identity {
    display: inline-block;

    .name {
      display: inline-block;

      &.other {
        font-weight: 100;
        opacity: 0.6;
      }

      &:not(.other) {
        font-weight: normal;
      }
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
