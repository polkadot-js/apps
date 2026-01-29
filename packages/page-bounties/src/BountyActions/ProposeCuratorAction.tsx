// Copyright 2017-2025 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { Balance, BountyIndex } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useState } from 'react';

import { getTreasuryProposalThreshold } from '@polkadot/apps-config';
import { Button, InputAddress, InputBalance, MarkError, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCollectiveInstance, useCollectiveMembers, useToggle } from '@polkadot/react-hooks';
import { BN } from '@polkadot/util';

import { truncateTitle } from '../helpers/index.js';
import { useBounties } from '../hooks/index.js';
import { useTranslation } from '../translate.js';

interface Props {
  description: string
  index: BountyIndex;
  proposals?: DeriveCollectiveProposal[];
  value: Balance;
}

const BOUNTY_METHODS = ['proposeCurator'];

function ProposeCuratorAction ({ description, index, proposals, value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isMember, members } = useCollectiveMembers('council');
  const councilMod = useCollectiveInstance('council');
  const { proposeCurator } = useBounties();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [curatorId, setCuratorId] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<BN>();
  const [fee, setFee] = useState<BN | null>();
  const [isFeeValid, setIsFeeValid] = useState(false);

  useEffect((): void => {
    members && setThreshold(
      new BN(Math.ceil(members.length * getTreasuryProposalThreshold(api)))
    );
  }, [api, members]);

  const proposeCuratorProposal = useMemo(
    () => curatorId && proposeCurator(index, curatorId, fee),
    [curatorId, fee, index, proposeCurator]
  );

  const isVotingInitiated = useMemo(
    () => proposals?.filter(({ proposal }) =>
      proposal && BOUNTY_METHODS.includes(proposal.method)
    ).length !== 0,
    [proposals]
  );

  useEffect(() => {
    setIsFeeValid(!!fee && !!value?.gt(fee));
  }, [value, fee]);

  return isMember && !isVotingInitiated && councilMod
    ? (
      <>
        <Button
          icon='step-forward'
          isDisabled={false}
          label={t('Propose curator')}
          onClick={toggleOpen}
        />
        {isOpen && (
          <Modal
            header={`${t('Propose curator')} - "${truncateTitle(description, 30)}"`}
            onClose={toggleOpen}
            size='large'
            testId='propose-curator-modal'
          >
            <Modal.Content>
              <Modal.Columns hint={t('The council member that will create the motion.')}>
                <InputAddress
                  filter={members}
                  label={t('proposing account')}
                  onChange={setAccountId}
                  type='account'
                  withLabel
                />
              </Modal.Columns>
              <Modal.Columns hint={t('Choose a curator whose background and expertise is such that they are capable of determining when the task is complete.')}>
                <InputAddress
                  label={t('select curator')}
                  onChange={setCuratorId}
                  withLabel
                />
              </Modal.Columns>
              <Modal.Columns hint={t('Part of the bounty value that will go to the Curator as a reward for their work')}>
                <InputBalance
                  isError={!isFeeValid}
                  isZeroable
                  label={t("curator's fee")}
                  onChange={setFee}
                  value={fee}
                />
                {!isFeeValid && (
                  <MarkError content={t("Curator's fee can't be higher than bounty value.")} />
                )}
              </Modal.Columns>
            </Modal.Content>
            <Modal.Actions>
              <TxButton
                accountId={accountId}
                icon='check'
                isDisabled={!isFeeValid}
                label={t('Propose curator')}
                onStart={toggleOpen}
                params={[threshold, proposeCuratorProposal, proposeCuratorProposal?.length]}
                tx={api.tx[councilMod].propose}
              />
            </Modal.Actions>
          </Modal>
        )}
      </>
    )
    : null;
}

export default React.memo(ProposeCuratorAction);
