// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useCallback, useState } from 'react';

import { InputAddress, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCollectiveInstance, useCollectiveMembers } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  closeModal: () => void,
  hash: string;
}

interface Threshold {
  isThresholdValid: boolean;
  threshold?: BN;
}

export function SlashTipModal ({ closeModal, hash }: Props) {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [{ isThresholdValid, threshold }, setThreshold] = useState<Threshold>({ isThresholdValid: false });
  const modLocation = useCollectiveInstance('council');
  const { members } = useCollectiveMembers('council');
  const { api } = useApi();
  const proposal = (api.tx.tips || api.tx.treasury).slashTip(hash);
  const { t } = useTranslation();

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
    <Modal
      header={t<string>('Propose a slash tip motion')}
      onClose={closeModal}
      size='medium'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('The council account for the proposal. The selection is filtered by the current members.')}>
          <InputAddress
            filter={members}
            help={t<string>('Select the account you wish to make the proposal with.')}
            label={t<string>('propose from account')}
            onChange={setAccountId}
            type='account'
            withLabel
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The desired threshold. Here set to a default of 50%+1, as applicable for general proposals.')}>
          <InputNumber
            className='medium'
            help={t<string>('The minimum number of council votes required to approve this motion')}
            isError={!threshold || threshold.eqn(0) || threshold.gtn(members.length)}
            label={t<string>('threshold')}
            onChange={_setThreshold}
            placeholder={t<string>('Positive number between 1 and {{memberCount}}', { replace: { memberCount: members.length } })}
            value={threshold || BN_ZERO}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={accountId}
          isDisabled={!isThresholdValid}
          label={t<string>('Propose')}
          onStart={closeModal}
          params={
            api.tx[modLocation].propose.meta.args.length === 3
              ? [threshold, proposal, proposal.encodedLength]
              : [threshold, proposal]
          }
          tx={api.tx[modLocation].propose}
        />
      </Modal.Actions>
    </Modal>
  );
}
