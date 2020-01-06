// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedCollectiveProposals, DerivedCollectiveProposal } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { AccountId, Balance } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useAccounts, useCall } from '@polkadot/react-hooks';

import Motion from './Motion';
import Propose from './Propose';
import translate from '../translate';

interface Props extends I18nProps {
  motions?: DerivedCollectiveProposals;
}

function Proposals ({ className, motions, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const members = useCall<[AccountId, Balance][]>(api.query.electionsPhragmen?.members || api.query.elections.members, []);
  const [isMember, setIsMember] = useState(false);

  useEffect((): void => {
    if (allAccounts && members) {
      setIsMember(
        members
          .map(([accountId]): string => accountId.toString())
          .some((accountId): boolean => allAccounts.includes(accountId))
      );
    }
  }, [allAccounts, members]);

  return (
    <div className={className}>
      <Propose isMember={isMember} />
      {motions?.length
        ? (
          <Table>
            <Table.Body>
              {motions?.map((motion: DerivedCollectiveProposal): React.ReactNode => (
                <Motion
                  isMember={isMember}
                  key={motion.hash.toHex()}
                  motion={motion}
                />
              ))}
            </Table.Body>
          </Table>
        )
        : t('No council motions')
      }
    </div>
  );
}

export default translate(Proposals);
