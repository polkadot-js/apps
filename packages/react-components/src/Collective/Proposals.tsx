// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedCollectiveProposal, DerivedCollectiveProposals } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { CollectiveProps } from './types';

import React from 'react';
import { Button, Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Propose from './Propose';
import Proposal from './Proposal'
import translate from '../translate';

interface Props extends CollectiveProps, I18nProps {}

function Proposals ({ className, collective, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const memberCount = useCall<number>(api.query[collective].members, [], {
    transform: (value: AccountId[]): number => value?.length || 0
  });
  const proposals = useCall<DerivedCollectiveProposals | null>(api.derive[collective].proposals, []);

  return (
    <div className={className}>
      <Button.Group>
        <Propose
          collective={collective}
          memberCount={memberCount || 0}
        />
      </Button.Group>
      {proposals?.length
        ? (
          <Table>
            <Table.Body>
              {proposals?.map((proposal: DerivedCollectiveProposal): React.ReactNode => (
                <Proposal
                  collective={collective}
                  proposal={proposal}
                  key={proposal.hash.toHex()}
                />
              ))}
            </Table.Body>
          </Table>
        )
        : (collective === 'council' ? t('No council motions') : t('No technical committee proposals'))
      }
    </div>
  );
}

export default translate(Proposals);
