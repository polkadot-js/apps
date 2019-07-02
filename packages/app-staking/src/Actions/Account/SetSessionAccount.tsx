// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/ui-app';
import { withApi, withMulti } from '@polkadot/ui-api';

import ValidateSession from './InputValidationSession';
import translate from '../../translate';

type Props = I18nProps & ApiProps & {
  controllerId: string,
  isOpen: boolean,
  onClose: () => void,
  sessionId?: string | null,
  stashId: string
};

type State = {
  sessionError: string | null,
  sessionId: string
};

class SetSessionKey extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      sessionError: null,
      sessionId: props.sessionId || props.controllerId
    };
  }

  render () {
    const { api, controllerId, isOpen, onClose, t } = this.props;
    const { sessionError, sessionId } = this.state;
    const isV2 = !!api.tx.session.setKeys;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--SetSessionAccount'
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
              accountId={controllerId}
              isDisabled={!sessionId || !!sessionError}
              isPrimary
              label={t('Set Session Key')}
              onClick={ onClose }
              params={ isV2 ? [{ auraKey: sessionId, grandpaKey: sessionId }, new Uint8Array([])] : [sessionId]}
              tx={isV2 ? 'session.setKeys' : 'session.setKey'}
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent () {
    const { controllerId, stashId, t } = this.props;
    const { sessionId } = this.state;

    return (
      <>
        <Modal.Header>
          {t('Set Session Key')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            defaultValue={controllerId}
            isDisabled
            label={t('controller account')}
          />
          <InputAddress
            className='medium'
            help={t('Changing the key only takes effect at the start of the next session. If validating, it must be an ed25519 key.')}
            label={t('session key')}
            onChange={this.onChangeSession}
            type='account'
            value={sessionId}
          />
          <ValidateSession
            controllerId={controllerId}
            onError={this.onSessionError}
            sessionId={sessionId}
            stashId={stashId}
          />
        </Modal.Content>
      </>
    );
  }

  private onChangeSession = (sessionId: string) => {
    this.setState({ sessionId });
  }

  private onSessionError = (sessionError: string | null) => {
    this.setState({ sessionError });
  }
}

export default withMulti(
  SetSessionKey,
  translate,
  withApi
);
