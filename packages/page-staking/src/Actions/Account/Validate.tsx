// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { withApi, withMulti } from '@polkadot/react-api/hoc';
import { InputAddress, InputNumber, Modal, TxButton, TxComponent } from '@polkadot/react-components';

import translate from '../../translate';

interface Props extends ApiProps, I18nProps {
  controllerId: string;
  isOpen: boolean;
  onClose: () => void;
  stashId: string;
}

interface State {
  commission: BN;
}

const COMM_MUL = new BN(10000000);
const MAX_COMM = new BN(100);

class Validate extends TxComponent<Props, State> {
  public state: State = {
    commission: new BN(0)
  };

  public render (): React.ReactNode {
    const { isOpen, t } = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--Staking'
        header={t('Set validator preferences')}
        size='small'
      >
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  private renderButtons (): React.ReactNode {
    const { controllerId, onClose, t } = this.props;
    const { commission } = this.state;

    return (
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={controllerId}
          icon='check circle outline'
          isPrimary
          label={t('Validate')}
          onStart={onClose}
          params={[{ commission }]}
          tx='staking.validate'
          withSpinner
        />
      </Modal.Actions>
    );
  }

  private renderContent (): React.ReactNode {
    const { controllerId, stashId, t } = this.props;

    return (
      <Modal.Content className='ui--signer-Signer-Content'>
        <InputAddress
          className='medium'
          defaultValue={stashId.toString()}
          isDisabled
          label={t('stash account')}
        />
        <InputAddress
          className='medium'
          defaultValue={controllerId}
          isDisabled
          label={t('controller account')}
        />
        <InputNumber
          className='medium'
          help={t('The percentage reward (0-100) that should be applied for the validator')}
          isZeroable
          label={t('reward commission percentage')}
          maxValue={MAX_COMM}
          onChange={this.onChangeCommission}
          onEnter={this.sendTx}
        />
      </Modal.Content>
    );
  }

  private onChangeCommission = (commission?: BN): void => {
    commission && this.setState({ commission: commission.mul(COMM_MUL) });
  }
}

export default withMulti(
  Validate,
  translate,
  withApi
);
