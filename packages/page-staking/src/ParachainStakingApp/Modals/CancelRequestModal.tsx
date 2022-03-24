// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  onClose: () => void;
  delegatorAddress: string;
  candidateAddress: string
}

function CancelRequestModal ({ className = '', delegatorAddress, candidateAddress, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Cancel request')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Columns>
            <InputAddress
              defaultValue={delegatorAddress}
              help={t<string>('The account that will cancel the request.')}
              isDisabled
              label={t<string>('delegator account')}
              type='account'
            />
          </Modal.Columns>
          <Modal.Columns hint={t<string>('This is the address of the collator candidate with a pending execution.')}>
            <InputAddress
              defaultValue={candidateAddress}
              isDisabled
              help={t<string>('Delegated collator candidate')}
              label={t<string>('collator candidate')}
              type='allPlus'
            />
          </Modal.Columns>

        </div>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={delegatorAddress}
          icon='paper-plane'
          label={t<string>('Cancel request')}
          onStart={onClose}
          params={
            [candidateAddress]
          }
          tx={
            api.tx.parachainStaking.cancelDelegationRequest
          }
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(CancelRequestModal)`
  .balance {
    margin-bottom: 0.5rem;
    text-align: right;
    padding-right: 1rem;

    .label {
      opacity: 0.7;
    }
  }

  label.with-help {
    flex-basis: 10rem;
  }

  .typeToggle {
    text-align: right;
  }

  .typeToggle+.typeToggle {
    margin-top: 0.375rem;
  }
`);
