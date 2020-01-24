// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Dropdown, InputAddress, Modal, TxButton, TxComponent } from '@polkadot/react-components';
import { withMulti } from '@polkadot/react-api/hoc';

import translate from '../../translate';
import { rewardDestinationOptions } from '../constants';

interface Props extends I18nProps {
  defaultDestination?: number;
  controllerId: string;
  onClose: () => void;
}

interface State {
  destination: number;
}

class SetRewardDestination extends TxComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      destination: 0
    };
  }

  public render (): React.ReactNode {
    const { controllerId, onClose, t } = this.props;
    const { destination } = this.state;
    const canSubmit = !!controllerId;

    return (
      <Modal
        className='staking--Bonding'
        header={t('Bonding Preferences')}
        size='small'
      >
        {this.renderContent()}
        <Modal.Actions onCancel={onClose}>
          <TxButton
            accountId={controllerId}
            isDisabled={!canSubmit}
            isPrimary
            label={t('Set reward destination')}
            icon='sign-in'
            onStart={onClose}
            params={[destination]}
            tx={'staking.setPayee'}
            ref={this.button}
            withSpinner
          />
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent (): React.ReactNode {
    const { controllerId, defaultDestination, t } = this.props;
    const { destination } = this.state;

    return (
      <Modal.Content className='ui--signer-Signer-Content'>
        <InputAddress
          className='medium'
          isDisabled
          defaultValue={controllerId}
          help={t('The controller is the account that is be used to control any nominating or validating actions. I will sign this transaction.')}
          label={t('controller account')}
        />
        <Dropdown
          className='medium'
          defaultValue={defaultDestination}
          help={t('The destination account for any payments as either a nominator or validator')}
          label={t('payment destination')}
          onChange={this.onChangeDestination}
          options={rewardDestinationOptions}
          value={destination}
        />
      </Modal.Content>
    );
  }

  private onChangeDestination = (destination: number): void => {
    this.setState({ destination });
  }
}

export default withMulti(
  SetRewardDestination,
  translate
);
