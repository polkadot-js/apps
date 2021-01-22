// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyIndex } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { getTreasuryProposalThreshold } from '@polkadot/apps-config';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useMembers, useToggle } from '@polkadot/react-hooks';

import { useBounties } from './hooks';
import { useTranslation } from './translate';

interface Props {
  index: BountyIndex;
  proposals?: DeriveCollectiveProposal[];
}

function CloseBounty ({ index, proposals }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isMember, members } = useMembers();
  const { closeBounty } = useBounties();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<BN>();

  useEffect((): void => {
    members && setThreshold(
      new BN(Math.ceil(members.length * getTreasuryProposalThreshold(api)))
    );
  }, [api, members]);

  const closeBountyProposal = useRef(closeBounty(index));

  const existingCloseBountyProposal = useMemo(() => proposals?.find(({ proposal }) => proposal.method === 'closeBounty'), [proposals]);

  return isMember && !existingCloseBountyProposal
    ? (
      <>
        <Button
          icon='step-forward'
          isDisabled={false}
          label={t<string>('Close')}
          onClick={toggleOpen}
        />
        {isOpen && (
          <Modal
            header={t<string>('close bounty')}
            size='large'
          >
            <Modal.Content>
              <Modal.Columns>
                <Modal.Column>
                  <p>{t<string>('This action will create a Council proposal to close the Bounty.')}</p>
                </Modal.Column>
                <Modal.Column>
                </Modal.Column>
              </Modal.Columns>
              <Modal.Columns>
                <Modal.Column>
                  <InputAddress
                    filter={members}
                    help={t<string>('Select the council account you wish to use to create a proposal for closing bounty.')}
                    label={t<string>('propose with account')}
                    onChange={setAccountId}
                    type='account'
                    withLabel
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{t<string>('The council member that will create the close bounty proposal, submission equates to an "aye" vote.')}</p>
                </Modal.Column>
              </Modal.Columns>
            </Modal.Content>
            <Modal.Actions onCancel={toggleOpen}>
              <TxButton
                accountId={accountId}
                icon='ban'
                isDisabled={false}
                label={t<string>('Close Bounty')}
                onStart={toggleOpen}
                params={[threshold, closeBountyProposal.current, closeBountyProposal.current.length]}
                tx={api.tx.council.propose}
              />
            </Modal.Actions>
          </Modal>
        )}
      </>
    )
    : null;
}

export default React.memo(CloseBounty);
