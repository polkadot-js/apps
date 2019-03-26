// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AccountId } from '@polkadot/types';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/ui-app';

import translate from '../translate';

type Props = I18nProps & {
  accountId: string,
  controllerId: AccountId | null,
  isOpen: boolean,
  onClose: () => void
};

type State = {
  nextController?: string
};

class Controller extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const { accountId, isOpen, onClose, t } = this.props;
    const { nextController } = this.state;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--Controller'
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
            accountId={accountId}
            isDisabled={!nextController}
            isPrimary
            label={t('Set Controller')}
            onClick={onClose}
            params={[nextController]}
            tx='session.setKey'
          />
        </Button.Group>
      </Modal.Actions>
      </Modal>
    );
  }

  private renderContent () {
    const { accountId, controllerId, t } = this.props;
    const { nextController } = this.state;
    const defaultValue = controllerId
      ? controllerId
      : undefined;

    return (
      <>
        <Modal.Header>
          {t('Controller Preferences')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            isDisabled
            label={t('stash account')}
            value={accountId}
          />
          <InputAddress
            autoFocus
            className='medium'
            value={nextController || defaultValue}
            label={t('controller account')}
            onChange={this.onChangeController}
            type='account'
          />
        </Modal.Content>
      </>
    );
  }

  private onChangeController = (nextController: string) => {
    this.setState({ nextController });
  }
}

export default translate(Controller);
