// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/ui-app';

import translate from '../translate';

type Props = I18nProps & {
  accountId: string,
  isOpen: boolean,
  onClose: () => void
};

type State = {
  sessionId?: string
};

class Key extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const { accountId, isOpen, onClose, t } = this.props;
    const { sessionId } = this.state;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--Stash'
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
            isDisabled={!sessionId}
            isPrimary
            label={t('Set Session Key')}
            onClick={onClose}
            params={[sessionId]}
            tx='session.setKey'
          />
        </Button.Group>
      </Modal.Actions>
      </Modal>
    );
  }

  private renderContent () {
    const { t } = this.props;
    const { sessionId } = this.state;

    return (
      <>
        <Modal.Header>
          {t('Key Preferences')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            help={t('Changing the key only takes effect at the start of the next session. If validating, you should (currently) use an ed25519 key.')}
            label={t('session key')}
            onChange={this.onChangeSession}
            value={sessionId}
            type='account'
          />
        </Modal.Content>
      </>
    );
  }

  private onChangeSession = (sessionId: string) => {
    this.setState({ sessionId });
  }
}

export default translate(Key);
