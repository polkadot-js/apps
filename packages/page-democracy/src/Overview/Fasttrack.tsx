// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Hash, VoteThreshold } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useState } from 'react';

import { getFastTrackThreshold } from '@polkadot/apps-config';
import { Button, Input, InputAddress, InputNumber, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useCollectiveInstance, useToggle } from '@polkadot/react-hooks';
import { BN } from '@polkadot/util';

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
  const [withVote, toggleVote] = useToggle(true);
  const modLocation = useCollectiveInstance('technicalCommittee');
  const proposalCount = useCall<BN>(modLocation && api.query[modLocation].proposalCount);

  const memberThreshold = useMemo(
    () => new BN(
      Math.ceil(
        members.length * getFastTrackThreshold(api, !votingBlocks || api.consts.democracy.fastTrackVotingPeriod.lte(votingBlocks))
      )
    ),
    [api, members, votingBlocks]
  );

  const extrinsic = useMemo(
    (): SubmittableExtrinsic<'promise'> | null => {
      if (!modLocation || !proposal || !proposalCount) {
        return null;
      }

      const proposeTx = api.tx[modLocation].propose.meta.args.length === 3
        ? api.tx[modLocation].propose(memberThreshold, proposal, proposalLength)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Old-type
        : api.tx[modLocation].propose(memberThreshold, proposal);

      return withVote
        ? api.tx.utility.batch([
          proposeTx,
          api.tx[modLocation].vote(proposal.method.hash, proposalCount, true)
        ])
        : proposeTx;
    }, [api, memberThreshold, modLocation, proposal, proposalCount, proposalLength, withVote]
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
          onClose={toggleFasttrack}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('Select the committee account you wish to make the proposal with.')}>
              <InputAddress
                filter={members}
                label={t<string>('propose from account')}
                onChange={setAcountId}
                type='account'
                withLabel
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The external proposal to send to the technical committee')}>
              <Input
                isDisabled
                label={t<string>('preimage hash')}
                value={imageHash.toHex()}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The voting period and delay to apply to this proposal. The threshold is calculated from these values.')}>
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
            </Modal.Columns>
            <Modal.Columns hint={t<string>('Submit an Aye vote alongside the proposal as part of a batch')}>
              <Toggle
                label={t<string>('Submit Aye vote with proposal')}
                onChange={toggleVote}
                value={withVote}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              extrinsic={extrinsic}
              icon='fast-forward'
              isDisabled={!accountId}
              label={t<string>('Fast track')}
              onStart={toggleFasttrack}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='fast-forward'
        isDisabled={!threshold.isSimpleMajority}
        label={t<string>('Fast track')}
        onClick={toggleFasttrack}
      />
    </>
  );
}

export default React.memo(Fasttrack);
