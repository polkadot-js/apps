// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Member as MemberType } from '../types';

import React, { useCallback, useContext, useMemo } from 'react';

import { AddressSmall, Menu, Popup, StatusContext, Tag } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';
import useMemberInfo from '../useMemberInfo';

interface Props {
  className?: string;
  info: MemberType;
  isPrime: boolean;
  isVoter: boolean;
}

function Member ({ className, info: { accountId, role }, isPrime, isVoter }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const info = useMemberInfo(accountId);
  const { queueExtrinsic } = useContext(StatusContext);

  const hasActions = useMemo(
    () => allAccounts.includes(accountId),
    [allAccounts, accountId]
  );

  const doRetire = useCallback(
    () => queueExtrinsic({
      accountId,
      extrinsic: api.tx.alliance.retire()
    }),
    [accountId, api, queueExtrinsic]
  );

  return (
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={accountId} />
      </td>
      <td className='all'>
        {(info && info.isUpForKicking && (
          <Tag
            color='red'
            hover={t<string>('Up for kicking')}
            label={t<string>('kicking')}
          />
        )) || (isPrime && (
          <Tag
            color='green'
            hover={t<string>('Current prime member, default voting')}
            label={t<string>('prime voter')}
          />
        )) || (isVoter && (
          <Tag
            color='green'
            hover={t<string>('Allowed to vote on motions')}
            label={t<string>('voter')}
          />
        ))}
      </td>
      <td className='number'>
        {info && info.deposit && (
          <FormatBalance value={info.deposit} />
        )}
      </td>
      <td className='number'>
        {role}
      </td>
      <td className='button'>
        {hasActions && (
          <Popup
            key='settings'
            value={
              <Menu>
                <Menu.Item
                  isDisabled={!!(info && (info.isUpForKicking || info.isRetiringAt))}
                  label={t<string>('Retire')}
                  onClick={doRetire}
                />
              </Menu>
            }
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(Member);
