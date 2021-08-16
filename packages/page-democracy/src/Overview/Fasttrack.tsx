// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Hash, VoteThreshold } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';

import { getFastTrackThreshold } from '@polkadot/apps-config';
import { Button, Input, InputAddress, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCollectiveInstance, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  imageHash: Hash;
  members: string[];
  threshold: VoteThreshold;
}

interface ProposalState {
  proposal?: SubmittableExtrinsic<'promise'> | null;
  proposalLength: number;
}

// default, assuming 6s blocks
const ONE_HOUR = (60 * 60) / 6;
const DEF_DELAY = new BN(ONE_HOUR);
const DEF_VOTING = new BN(3 * ONE_HOUR);

function Fasttrack ({ imageHash, members, threshold }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isFasttrackOpen, toggleFasttrack] = useToggle();
  const [accountId, setAcountId] = useState<string | null>(null);
  const [delayBlocks, setDelayBlocks] = useState<BN | undefined>(DEF_DELAY);
  const [votingBlocks, setVotingBlocks] = useState<BN | undefined>(api.consts.democracy.fastTrackVotingPeriod || DEF_VOTING);
  const [{ proposal, proposalLength }, setProposal] = useState<ProposalState>(() => ({ proposalLength: 0 }));
  const modLocation = useCollectiveInstance('technicalCommittee');

  const memberThreshold = useMemo(
    () => new BN(
      Math.ceil(
        members.length * getFastTrackThreshold(api, !votingBlocks || api.consts.democracy.fastTrackVotingPeriod.lte(votingBlocks))
      )
    ),
    [api, members, votingBlocks]
  );

  useEffect((): void => {
    const proposal = delayBlocks && !delayBlocks.isZero() && votingBlocks && !votingBlocks.isZero()
      ? api.tx.democracy.fastTrack(imageHash, votingBlocks, delayBlocks)
      : null;

    setProposal({
      proposal,
      proposalLength: proposal?.length || 0
    });
  }, [api, delayBlocks, imageHash, members, votingBlocks]);

  if (!modLocation) {
    return null;
  }

  return (
    <>
      {isFasttrackOpen && (
        <Modal
          header={t<string>('Fast track proposal')}
          size='small'
        >
          <Modal.Content>
            <InputAddress
              filter={members}
              help={t<string>('Select the account you wish to make the proposal with.')}
              label={t<string>('propose from account')}
              onChange={setAcountId}
              type='account'
              withLabel
            />
            <Input
              help={t<string>('The external proposal to send to the technical committee')}
              isDisabled
              label={t<string>('preimage hash')}
              value={imageHash.toHex()}
            />
            <InputNumber
              autoFocus
              help={t<string>('The voting period to apply in blocks')}
              isZeroable={false}
              label={t<string>('voting period')}
              onChange={setVotingBlocks}
              value={votingBlocks}
            />
            <InputNumber
              help={t<string>('The delay period to apply in blocks')}
              isZeroable={false}
              label={t<string>('delay')}
              onChange={setDelayBlocks}
              value={delayBlocks}
            />
            <InputNumber
              defaultValue={memberThreshold}
              isDisabled
              label={t<string>('threshold')}
            />
          </Modal.Content>
          <Modal.Actions onCancel={toggleFasttrack}>
            <TxButton
              accountId={accountId}
              icon='fast-forward'
              isDisabled={!accountId || !proposal}
              label={t<string>('Fast track')}
              onStart={toggleFasttrack}
              params={
                api.tx[modLocation].propose.meta.args.length === 3
                  ? [memberThreshold, proposal, proposalLength]
                  : [memberThreshold, proposal]
              }
              tx={api.tx[modLocation].propose}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='fast-forward'
        isDisabled={!threshold.isSimplemajority}
        label={t<string>('Fast track')}
        onClick={toggleFasttrack}
      />
    </>
  );
}

export default React.memo(Fasttrack);
