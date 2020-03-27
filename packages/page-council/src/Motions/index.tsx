// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedCollectiveProposals, DerivedCollectiveProposal } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import { Button, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import useCouncilMembers from '../useCouncilMembers';
import Motion from './Motion';
import ProposeMotion from './ProposeMotion';
import ProposeExternal from './ProposeExternal';
import Slashing from './Slashing';

interface Props {
  className?: string;
  motions?: DerivedCollectiveProposals;
  prime: AccountId | null;
}

function Proposals ({ className, motions, prime }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { isMember, members } = useCouncilMembers();

  return (
    <div className={className}>
      <Button.Group>
        <ProposeMotion
          filter={members}
          isMember={isMember}
          members={members}
        />
        <Button.Or />
        <ProposeExternal
          isMember={isMember}
          members={members}
        />
        <Button.Or />
        <Slashing
          isMember={isMember}
          members={members}
        />
      </Button.Group>
      {motions?.length
        ? (
          <Table>
            <Table.Body>
              {motions?.map((motion: DerivedCollectiveProposal): React.ReactNode => (
                <Motion
                  isMember={isMember}
                  key={motion.hash.toHex()}
                  members={members}
                  motion={motion}
                  prime={prime}
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

export default React.memo(Proposals);
