// Copyright 2017-2025 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSociety, DeriveSocietyMember } from '@polkadot/api-derive/types';
import type { SocietyVote } from '@polkadot/types/interfaces';
import type { VoteType } from '../types.js';

import React, { useRef } from 'react';

import { AddressSmall, Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import DefenderVoting from './DefenderVoting.js';
import Votes from './Votes.js';

interface Props {
  className?: string;
  info?: DeriveSociety;
  isMember: boolean;
  ownMembers: string[];
}

const OPT_VOTES = {
  transform: (members: DeriveSocietyMember[]): VoteType[] =>
    members
      .filter(({ vote }): boolean => !!vote)
      .map(({ accountId, vote }): VoteType => [accountId.toString(), vote as unknown as SocietyVote])
};

function Defender ({ className = '', info, isMember, ownMembers }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const votes = useCall<VoteType[]>(api.derive.society.members, undefined, OPT_VOTES);

  const headerRef = useRef<[React.ReactNode?, string?, number?][]>([
    [t('defender'), 'start'],
    [undefined, 'expand'],
    []
  ]);

  if (!info || !info.hasDefender || !info.defender) {
    return null;
  }

  return (
    <Table
      className={className}
      header={headerRef.current}
    >
      <tr>
        <td className='address all'>
          <AddressSmall value={info.defender} />
        </td>
        <Votes votes={votes} />
        <td className='button'>
          <DefenderVoting
            isMember={isMember}
            ownMembers={ownMembers}
          />
        </td>
      </tr>
    </Table>
  );
}

export default React.memo(Defender);
