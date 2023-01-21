// Copyright 2017-2023 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { Member as MemberType } from '../types';

import React, { useCallback, useMemo } from 'react';

import { AddressSmall, Menu, Popup, Tag } from '@polkadot/react-components';
import { useAccounts, useApi, useQueue } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import useMemberInfo from '../useMemberInfo';

interface Props {
  bestNumber?: BN;
  className?: string;
  info: MemberType;
  isPrime: boolean;
  isVoter: boolean;
}

function Member ({ bestNumber, className, info: { accountId, role }, isPrime, isVoter }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const info = useMemberInfo(accountId);
  const { queueExtrinsic } = useQueue();
  const hasNotice = !!api.tx.alliance.giveRetirementNotice;

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

  const doNotice = useCallback(
    () => queueExtrinsic({
      accountId,
      extrinsic: api.tx.alliance.giveRetirementNotice()
    }),
    [accountId, api, queueExtrinsic]
  );

  return (
    <tr className={className}>
      <td className='address all relative'>
        <AddressSmall value={accountId} />
        <div className='absolute'>
          {(info && info.isRetiringAt && (
            <Tag
              color='yellow'
              hover={t<string>('Is retiring')}
              label={t<string>('retirting')}
            />
          )) || (info && info.isUpForKicking && (
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
        </div>
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
                {hasNotice && (
                  <Menu.Item
                    isDisabled={!!(info && info.isRetiringAt)}
                    label={t<string>('Announce retirement')}
                    onClick={doNotice}
                  />
                )}
                <Menu.Item
                  isDisabled={
                    !!info && (
                      info.isUpForKicking ||
                      (
                        hasNotice
                          ? !bestNumber || !info.isRetiringAt || info.isRetiringAt.lt(bestNumber)
                          : false
                      )
                    )
                  }
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
