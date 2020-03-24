// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSociety, DeriveSocietyMember } from '@polkadot/api-derive/types';
import { SocietyVote } from '@polkadot/types/interfaces';
import { OwnMembers, VoteType } from '../types';

import React from 'react';
import { AddressSmall, Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import DefenderVoting from './DefenderVoting';
import VoteDisplay from './VoteDisplay';

interface Props extends OwnMembers {
  className?: string;
  info?: DeriveSociety;
}

export default function Defender ({ className, info, isMember, ownMembers }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const votes = useCall<VoteType[]>(api.derive.society.members, [], {
    transform: (members: DeriveSocietyMember[]): VoteType[] =>
      members
        .filter(({ vote }): boolean => !!vote)
        .map(({ accountId, vote }): VoteType => [accountId.toString(), vote as SocietyVote])
  });

  if (!info || !info.hasDefender || !info.defender) {
    return null;
  }

  return (
    <div className={`overviewSection ${className}`}>
      <h1>{t('defender')}</h1>
      <Table>
        <Table.Body>
          <tr>
            <td className='address'>
              <AddressSmall value={info.defender} />
            </td>
            <VoteDisplay votes={votes} />
            <td className='top together number'>
              <DefenderVoting
                isMember={isMember}
                ownMembers={ownMembers}
              />
            </td>
          </tr>
        </Table.Body>
      </Table>
    </div>
  );
}
