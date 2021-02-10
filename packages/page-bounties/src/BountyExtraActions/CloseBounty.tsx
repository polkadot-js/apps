// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BountyIndex } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useRef, useState } from 'react';

import { getTreasuryProposalThreshold } from '@polkadot/apps-config';
import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useMembers } from '@polkadot/react-hooks';

import { truncateTitle } from '../helpers';
import { useBounties } from '../hooks';
import { useTranslation } from '../translate';

interface Props {
  description: string;
  index: BountyIndex;
  toggleOpen: () => void;
}

function CloseBounty ({ description, index, toggleOpen }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { members } = useMembers();
  const { closeBounty } = useBounties();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<BN>();

  useEffect((): void => {
    members && setThreshold(
      new BN(Math.ceil(members.length * getTreasuryProposalThreshold(api)))
    );
  }, [api, members]);

  const closeBountyProposal = useRef(closeBounty(index));

  return (
    <Modal
      header={`${t<string>('close bounty')} - "${truncateTitle(description, 30)}"`}
      size='large'
    >
      <Modal.Content>
        <Modal.Column>
          <p>{t<string>('This action will create a Council proposal to close the Bounty.')}</p>
        </Modal.Column>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              filter={members}
              help={t<string>('Select the council member account you wish to use to create a proposal for closing bounty.')}
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
  );
}

export default React.memo(CloseBounty);
