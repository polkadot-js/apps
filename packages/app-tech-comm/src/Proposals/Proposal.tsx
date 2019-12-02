// Copyright 2017-2019 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Proposal as ProposalType, Votes } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { useApi, trackStream } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

import { ActionItem, InputAddress, Labelled, Voting } from '@polkadot/react-components';

import translate from '../translate';

interface Props extends I18nProps {
  hash: string;
}

function Proposal ({ className, hash, t }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const proposal = trackStream<ProposalType>(api.query.technicalCommittee.proposalOf, [hash]);
  const votes = trackStream<Option<Votes>>(api.query.technicalCommittee.voting, [hash]);

  if (!proposal || !votes?.isSome) {
    return null;
  }

  const { ayes, index, nays, threshold } = votes.unwrap();

  return (
    <ActionItem
      className={className}
      accessory={
        <Voting
          hash={hash}
          proposalId={index}
          proposal={proposal}
        />
      }
      expandNested
      idNumber={index}
      proposal={proposal}
    >
      <div>
        <h4>{t('ayes ({{ayes}}/{{threshold}} to approve)', {
          replace: {
            ayes: ayes.length,
            threshold: threshold.toString()
          }
        })}</h4>
        {ayes.map((address, index): React.ReactNode => (
          <Labelled
            key={`${index}:${address}`}
            label={t('Aye')}
          >
            <InputAddress
              isDisabled
              defaultValue={address}
              withLabel={false}
            />
          </Labelled>
        ))}
        <h4>{t('nays ({{nays}})', {
          replace: {
            nays: nays.length
          }
        })}</h4>
        {nays.map((address, index): React.ReactNode => (
          <Labelled
            key={`${index}:${address}`}
            label={t('Nay')}
          >
            <InputAddress
              isDisabled
              defaultValue={address}
              withLabel={false}
            />
          </Labelled>
        ))}
      </div>
    </ActionItem>
  );
}

export default translate(Proposal);
