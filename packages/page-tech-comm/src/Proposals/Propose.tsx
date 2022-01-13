// Copyright 2017-2022 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';

import React, { useCallback, useState } from 'react';

import { Button, Extrinsic, InputAddress, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCollectiveInstance, useModal } from '@polkadot/react-hooks';
import { BN } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  isMember: boolean;
  members: string[];
  type: 'membership' | 'technicalCommittee';
}

interface ProposalState {
  proposal?: SubmittableExtrinsic<'promise'> | null;
  proposalLength: number;
}

function Propose ({ isMember, members, type }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api, apiDefaultTxSudo } = useApi();
  const { isOpen, onClose, onOpen } = useModal();
  const [accountId, setAcountId] = useState<string | null>(null);
  const [{ proposal, proposalLength }, setProposal] = useState<ProposalState>({ proposalLength: 0 });
  const [[threshold, hasThreshold], setThreshold] = useState<[BN | null, boolean]>([
    new BN(members.length / 2 + 1),
    true
  ]);
  const modLocation = useCollectiveInstance(type);

  const _hasThreshold = useCallback(
    (threshold?: BN | null): boolean =>
      !!threshold && !threshold.isZero() && threshold.lten(members.length),
    [members]
  );

  const _onChangeExtrinsic = useCallback(
    (proposal?: SubmittableExtrinsic<'promise'>): void => setProposal({
      proposal,
      proposalLength: proposal?.length || 0
    }),
    []
  );
  const _onChangeThreshold = useCallback(
    (threshold?: BN): void => setThreshold([threshold || null, _hasThreshold(threshold)]),
    [_hasThreshold]
  );

  if (!modLocation) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <Modal
          header={t<string>('Propose a committee motion')}
          onClose={onClose}
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
            <InputNumber
              className='medium'
              help={t<string>('The minimum number of committee votes required to approve this motion')}
              isError={!hasThreshold}
              label={t<string>('threshold')}
              onChange={_onChangeThreshold}
              placeholder={t<string>('Positive number between 1 and {{count}}', { replace: { count: members.length } })}
              value={threshold || undefined}
            />
            <Extrinsic
              defaultValue={apiDefaultTxSudo}
              label={t<string>('proposal')}
              onChange={_onChangeExtrinsic}
            />
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              isDisabled={!hasThreshold || !proposal}
              onStart={onClose}
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
      <Button
        icon='plus'
        isDisabled={!isMember}
        label={t<string>('Submit proposal')}
        onClick={onOpen}
      />
    </>
  );
}

export default React.memo(Propose);
