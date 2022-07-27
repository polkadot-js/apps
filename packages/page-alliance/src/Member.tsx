// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Member as MemberType } from './types';

import React, { useCallback, useContext, useMemo } from 'react';

import { AddressSmall, Badge, Menu, Popup, StatusContext } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from './translate';
import useMemberInfo from './useMemberInfo';

interface Props {
  className?: string;
  info: MemberType;
}

function Member ({ className, info: { accountId, role } }: Props): React.ReactElement<Props> {
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
      <td className='badge'>
        {info && info.isUpForKicking && (
          <Badge
            color='red'
            icon='ban'
          />
        )}
      </td>
      <td className='address all'>
        <AddressSmall value={accountId} />
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
                  isDisabled={info && info.isUpForKicking}
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
