// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, BlockNumber, ProposalIndex } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { TxSource, TxDef } from '@polkadot/react-hooks/types';

import BN from 'bn.js';
import React, { useState } from 'react';
import { Button, Dropdown, InputNumber, TxModalNew as TxModal } from '@polkadot/react-components';
import { useApi, useCall, useModal, useTx } from '@polkadot/react-hooks';

import translate from '../translate';

interface Props extends I18nProps {
  isApproved?: boolean;
  proposalInfo?: React.ReactNode;
  proposalId: ProposalIndex;
}

function Approve ({ proposalId, proposalInfo = null, t }: Props): React.ReactElement<Props> {
  const options = [
    { text: t('Aye, I approve'), value: true },
    { text: t('Nay, I do not approve'), value: false }
  ];

  const { api } = useApi();
  const memberCount = useCall<BN>(api.query.council.members, [], {
    transform: (value: AccountId[]): BN => {
      return new BN(1 + (value.length / 2));
    }
  }) || new BN(0);

  const _hasThreshold = (threshold: BN | null) => !!threshold && threshold.gtn(0) && threshold.lte(memberCount);

  const [isApproving, setIsApproving] = useState(false);
  const [threshold, setThreshold] = useState<BN | null>(memberCount);

  const _onChangeThreshold = (threshold?: BN) =>
    setThreshold(threshold || null);

  const txState = useTx(
    (): TxSource<TxDef> => [
      [
        'council.propose',
        (): any[] => {
          const method = isApproving ? 'approveProposal' : 'rejectProposal';
          const spendProposal = api.tx.treasury[method](proposalId.toString());
      
          return [threshold, spendProposal];
        }
      ],
      !!proposalId && _hasThreshold(threshold)
    ],
    [proposalId, threshold]
  );
  const modalState = useModal();

  return (
    <TxModal
      {...txState}
      {...modalState}
      header={t('Approve or reject proposal')}
      preContent={proposalInfo}
      trigger={
        ({ onOpen }): React.ReactElement => ((
          <div className='ui--Row-buttons'>
            <Button.Group>
              <Button
                isPrimary
                label={t('Respond')}
                icon='reply'
                onClick={onOpen}
              />
            </Button.Group>
          </div>
        ))
      }
    >
      <Dropdown
        help={t('Propose a majority council motion to either approve or reject this spend proposal')}
        label={t('proposed council action')}
        options={options}
        onChange={setIsApproving}
        value={isApproving}
      />
      <InputNumber
        className='medium'
        label={t('threshold')}
        help={t(`The minimum number of council votes required to approve or reject this spend proposal`)}
        isError={!_hasThreshold(threshold)}
        onChange={_onChangeThreshold}
        onEnter={txState.sendTx}
        onEscape={modalState.onClose}
        placeholder={t('Positive number between 1 and {{memberCount}}', { replace: { memberCount } })}
        value={threshold || undefined}
      />
    </TxModal>
  )
}

// class Approve2 extends TxModal<Props, State> {
//   public state: State = {
//     ...this.defaultState,
//     isApproving: false
//   };

//   private approveOptions = (): { text: string; value: boolean }[] => [
//     { text: this.props.t('Aye, I approve'), value: true },
//     { text: this.props.t('Nay, I do not approve'), value: false }
//   ]

//   protected headerText = (): string => this.props.t('Approve or reject proposal');

//   protected txMethod = (): string => 'council.propose';

//   protected txParams = (): [number, any] => {
//     const { api, proposalId, threshold } = this.props;
//     const { isApproving } = this.state;

//     const method = isApproving ? 'approveProposal' : 'rejectProposal';
//     const spendProposal = api.tx.treasury[method](proposalId);

//     return [threshold, spendProposal];
//   }

//   protected renderTrigger = (): React.ReactNode => {
//     const { api, t } = this.props;

//     // disable voting for 1.x (we only use elections here)
//     if (!api.query.elections) {
//       return null;
//     }

//     return (
//     );
//   }

//   protected renderPreContent = (): React.ReactNode => {
//     const { proposalInfo = null } = this.props;

//     if (!proposalInfo) {
//       return null;
//     }

//     return proposalInfo;
//   }

//   protected renderContent = (): React.ReactNode => {
//     const { t } = this.props;
//     const { isApproving } = this.state;

//     return (
//       <Dropdown
//         help={t('Propose a majority council motion to either approve or reject this spend proposal')}
//         label={t('proposed council action')}
//         options={this.approveOptions()}
//         onChange={this.onChangeApproving}
//         value={isApproving}
//       />
//     );
//   }

//   private onChangeApproving = (isApproving: boolean): void => {
//     this.setState({ isApproving });
//   }
// }

export default translate(Approve);
