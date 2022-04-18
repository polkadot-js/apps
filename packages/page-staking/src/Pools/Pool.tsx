// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { MembersMapEntry, Params } from './types';

import React, { useCallback } from 'react';

import { AddressMini, ExpanderScroll } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Join from './Join';
import usePoolInfo from './usePoolInfo';

interface Props {
  className?: string;
  id: BN;
  members: MembersMapEntry[];
  params: Params;
}

function Pool ({ className, id, members, params }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const info = usePoolInfo(id);
  const renderMembers = useCallback(
    () => members.map(({ accountId }, count) => (
      <AddressMini
        key={`${count}:${accountId.toHex()}`}
        value={accountId}
        withBalance={false}
        withShrink
      />
    )),
    [members]
  );

  if (!info) {
    return null;
  }

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td className='start'>{info.metadata}</td>
      <td className='number'><FormatBalance value={info.bonded && info.bonded.points} /></td>
      <td className='number'>
        {members && members.length !== 0 && (
          <ExpanderScroll
            empty={t<string>('No members')}
            renderChildren={renderMembers}
            summary={t<string>('Members ({{count}})', { replace: { count: members.length } })}
          />
        )}
      </td>
      <td className='button'>
        <Join
          id={id}
          isDisabled={!info.bonded || !info.bonded.state.isOpen || !info.bonded.delegatorCounter.ltn(params.maxMembersPerPool)}
          params={params}
        />
      </td>
    </tr>
  );
}

export default React.memo(Pool);
