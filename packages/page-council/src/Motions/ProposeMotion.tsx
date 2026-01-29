// Copyright 2017-2025 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';

import React, { useCallback, useEffect, useState } from 'react';

import { getProposalThreshold } from '@polkadot/apps-config';
import { Button, InputAddress, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCollectiveInstance, useToggle } from '@polkadot/react-hooks';
import { Extrinsic } from '@polkadot/react-params';
import { BN, BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  isMember: boolean;
  members: string[];
}

interface Threshold {
  isThresholdValid: boolean;
  threshold?: BN;
}

interface ProposalState {
  proposal?: SubmittableExtrinsic<'promise'> | null;
  proposalLength: number;
}

function Propose ({ isMember, members }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api, apiDefaultTxSudo } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAcountId] = useState<string | null>(null);
  const [{ proposal, proposalLength }, setProposal] = useState<ProposalState>({ proposalLength: 0 });
  const [{ isThresholdValid, threshold }, setThreshold] = useState<Threshold>({ isThresholdValid: false });
  const modLocation = useCollectiveInstance('council');

  useEffect((): void => {
    members && setThreshold({
      isThresholdValid: members.length !== 0,
      threshold: new BN(Math.min(members.length, Math.ceil(members.length * getProposalThreshold(api))))
    });
  }, [api, members]);

  const _setMethod = useCallback(
    (proposal?: SubmittableExtrinsic<'promise'> | null) => setProposal({
      proposal,
      proposalLength: proposal?.encodedLength || 0
    }),
    []
  );

  const _setThreshold = useCallback(
    (threshold?: BN) => setThreshold({
      isThresholdValid: !!threshold?.gtn(0),
      threshold
    }),
    []
  );

  if (!modLocation) {
    return null;
  }

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!isMember}
        label={t('Propose motion')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          header={t('Propose a council motion')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('The council account for the proposal. The selection is filtered by the current members.')}>
              <InputAddress
                filter={members}
                label={t('propose from account')}
                onChange={setAcountId}
                type='account'
                withLabel
              />
            </Modal.Columns>
            <Modal.Columns hint={t('The desired threshold. Here set to a default of 50%+1, as applicable for general proposals.')}>
              <InputNumber
                className='medium'
                isError={!threshold || threshold.eqn(0) || threshold.gtn(members.length)}
                label={t('threshold')}
                onChange={_setThreshold}
                placeholder={t('Positive number between 1 and {{memberCount}}', { replace: { memberCount: members.length } })}
                value={threshold || BN_ZERO}
              />
            </Modal.Columns>
            <Modal.Columns hint={t('The actual proposal to make, based on the selected call and parameters thereof.')}>
              <Extrinsic
                defaultValue={apiDefaultTxSudo}
                label={t('proposal')}
                onChange={_setMethod}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              isDisabled={!proposal || !isThresholdValid}
              label={t('Propose')}
              onStart={toggleOpen}
              params={
                api.tx[modLocation].propose.meta.args.length === 3
                  ? [threshold, proposal, proposalLength]
                  : [threshold, proposal]
              }
              tx={api.tx[modLocation].propose}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Propose);
