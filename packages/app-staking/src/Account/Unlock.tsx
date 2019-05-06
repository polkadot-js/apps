// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AccountId } from '@polkadot/types';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/ui-app';

import translate from '../translate';

type Props = I18nProps & {
  controllerId?: AccountId | null,
  isOpen: boolean,
  onClose: () => void
};

type State = {
  controllerId: string,
  destination: number
};

class Unlock extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);
  }

  render () {
    const { controllerId, isOpen, onClose, t } = this.props;
    const canSubmit = !!controllerId;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--Unlocking'
        dimmer='inverted'
        open
        size='small'
      >
        {this.renderContent()}
        <Modal.Actions>
          <Button.Group>
            <Button
              isNegative
              onClick={onClose}
              label={t('Cancel')}
            />
            <Button.Or />
            <TxButton
              accountId={controllerId && controllerId.toString()}
              isDisabled={!canSubmit}
              isPrimary
              label={t('Unlock')}
              onClick={onClose}
              params={[]}
              tx='staking.withdrawUnbonded'
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent () {
    const { controllerId, t } = this.props;

    return (
      <>
        <Modal.Header>
          {t('Unlocking Preferences')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            defaultValue={controllerId && controllerId.toString()}
            isDisabled
            label={t('controler account')}
          />
        </Modal.Content>
      </>
    );
  }
}

export default translate(Unlock);
