// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/ui-app';

import ValidateSession from './InputValidationSession';
import translate from '../../translate';

type Props = I18nProps & {
  controllerId: string,
  inValidationProcess?: boolean,
  onClose: () => void,
  nextStep?: any,
  sessionId?: string,
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
    const { controllerId, inValidationProcess = false, onClose, nextStep, t } = this.props;
    const { sessionError, sessionId } = this.state;

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
              label={inValidationProcess ? t('Next') : t('Set Session Key')}
              onClick={ nextStep ? null : onClose }
              onSuccess={nextStep}
              params={[sessionId]}
              tx='session.setKey'
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent () {
    const { controllerId, inValidationProcess = false, stashId, t } = this.props;
    const { sessionId } = this.state;

    return (
      <>
        <Modal.Header>
          {inValidationProcess ? t('Step 1 - Session Key') : t('Change Session Key')}
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

export default translate(SetSessionKey);
