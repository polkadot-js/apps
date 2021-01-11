// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';

import { getTreasuryProposalThreshold } from '@polkadot/apps-config';
import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useMembers, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useBounties } from './hooks';
import { useTranslation } from './translate';

interface Props {
  index: number;
  proposals?: DeriveCollectiveProposal[];
}

const BOUNTY_METHODS = ['proposeCurator'];

function ProposeCuratorAction ({ index, proposals }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isMember, members } = useMembers();
  const { proposeCurator } = useBounties();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [curatorId, setCuratorId] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<BN>();
  const [fee, setFee] = useState<BN>(BN_ZERO);

  useEffect((): void => {
    members && setThreshold(
      new BN(Math.ceil(members.length * getTreasuryProposalThreshold(api)))
    );
  }, [api, members]);

  const proposeCuratorProposal = useMemo(() => curatorId && proposeCurator(index, curatorId, fee), [curatorId, fee, index, proposeCurator]);

  console.log(curatorId);
  const isVotingInitiated = useMemo(() => proposals?.filter(({ proposal }) => BOUNTY_METHODS.includes(proposal.method)).length !== 0, [proposals]);

  return isMember && !isVotingInitiated
    ? (
      <>
        <Button
          icon='step-forward'
          isDisabled={false}
          label={t<string>('Propose Curator')}
          onClick={toggleOpen}
        />
        {isOpen && (
          <Modal
            header={t<string>('Propose Curator to ...')}
            size='large'
          >
            <Modal.Content>
              <Modal.Columns>
                <Modal.Column>
                  <p>{t<string>('This action will create a Council motion to propose Curator.')}</p>
                </Modal.Column>
                <Modal.Column>
                </Modal.Column>
              </Modal.Columns>
              <Modal.Columns>
                <Modal.Column>
                  <InputAddress
                    filter={members}
                    help={t<string>('Select the council account you wish to use to create a motion for the Bounty.')}
                    label={t<string>('vote with account')}
                    onChange={setAccountId}
                    type='account'
                    withLabel
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{t<string>('The council member that will create a motion, submission equates to an "aye" vote for chosen option.')}</p>
                </Modal.Column>
              </Modal.Columns>
              <Modal.Columns>
                <Modal.Column>
                  <p>{t<string>('Select Curator')}</p>
                </Modal.Column>
                <Modal.Column>
                </Modal.Column>
              </Modal.Columns>
              <Modal.Columns>
                <Modal.Column>
                  <InputAddress
                    help={t<string>('...')}
                    label={t<string>('Select Curator')}
                    onChange={setCuratorId}
                    type='account'
                    withLabel
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{t<string>('The account that will ...')}</p>
                </Modal.Column>
              </Modal.Columns>
              <Modal.Columns>
                <Modal.Column>
                  <p>{t<string>("Curator's fee.")}</p>
                </Modal.Column>
                <Modal.Column>
                </Modal.Column>
              </Modal.Columns>
              <Modal.Columns>
                <Modal.Column>
                  <InputBalance
                    help={t<string>('...')}
                    isZeroable
                    label={t<string>('...')}
                    onChange={setFee}
                    value={fee}
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{t<string>('....')}</p>
                </Modal.Column>
              </Modal.Columns>
            </Modal.Content>
            <Modal.Actions onCancel={toggleOpen}>
              <TxButton
                accountId={accountId}
                icon='check'
                isDisabled={false}
                label={t<string>('Assign curator')}
                onStart={toggleOpen}
                params={[threshold, proposeCuratorProposal, proposeCuratorProposal?.length]}
                tx={api.tx.council.propose}
              />
            </Modal.Actions>
          </Modal>
        )}
      </>
    )
    : null;
}

export default React.memo(ProposeCuratorAction);
