// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/ui-app';
import { withApi, withMulti } from '@polkadot/ui-api';

import ValidationSessionKey from './InputValidationSessionKey';
import translate from '../../translate';

type Props = I18nProps & ApiProps & {
  controllerId: string;
  isOpen: boolean;
  onClose: () => void;
  sessionIds: string[];
  stashId: string;
};

interface State {
  babe: string;
  babeError: string | null;
  // TODO rename grandpa
  ed25519: string;
  ed25519Error: string | null;
  imOnline: string;
  imOnlineError: string | null;
}

class SetSessionKey extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    this.state = {
      babe: props.sessionIds[1] || props.controllerId,
      babeError: null,
      ed25519: props.sessionIds[0] || props.controllerId,
      ed25519Error: null,
      imOnline: props.sessionIds[2] || props.controllerId,
      imOnlineError: null
    };
  }

  public render (): React.ReactNode {
    const { controllerId, isOpen, isSubstrateV2, onClose, t } = this.props;
    const { ed25519, ed25519Error, babe, babeError, imOnline, imOnlineError } = this.state;

    if (!isOpen) {
      return null;
    }

    const hasError = !ed25519 || !!ed25519Error || (isSubstrateV2 ? ((!babe || !!babeError) && (!imOnline || !!imOnlineError)) : false);

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
              isDisabled={hasError}
              isPrimary
              label={t('Set Session Key')}
              onClick={onClose}
              params={
                isSubstrateV2
                  ? [{ babe, grandpa: ed25519, imOnline }, new Uint8Array([])]
                  : [ed25519]
              }
              tx={
                isSubstrateV2
                  ? 'session.setKeys'
                  : 'session.setKey'
              }
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent (): React.ReactNode {
    const { controllerId, isSubstrateV2, stashId, t } = this.props;
    const { ed25519, imOnline, babe } = this.state;

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
            label={
              isSubstrateV2
                ? t('Grandpa key')
                : t('Session key (ed25519)')
            }
            onChange={this.onChangeEd25519}
            value={ed25519}
          />
          <ValidationSessionKey
            controllerId={controllerId}
            onError={this.onSessionErrorEd25519}
            sessionId={ed25519}
            stashId={stashId}
          />
          {
            isSubstrateV2
              ? (
                <>
                  <InputAddress
                    className='medium'
                    help={t('Changing the key only takes effect at the start of the next session. If validating, it must be an sr25519 key.')}
                    label={t('Babe key')}
                    onChange={this.onChangeBabe}
                    value={babe}
                  />
                  <ValidationSessionKey
                    controllerId={controllerId}
                    onError={this.onSessionErrorBabe}
                    sessionId={babe}
                    stashId={stashId}
                  />
                  <InputAddress
                    className='medium'
                    help={t('Changing the key only takes effect at the start of the next session.')}
                    label={t('ImOnline key')}
                    onChange={this.onChangeImOnline}
                    value={imOnline}
                  />
                  <ValidationSessionKey
                    controllerId={controllerId}
                    onError={this.onSessionErrorImOnline}
                    sessionId={imOnline}
                    stashId={stashId}
                  />
                </>
              )
              : null
          }

        </Modal.Content>
      </>
    );
  }

  private onChangeBabe = (babe: string): void => {
    this.setState({ babe });
  }

  private onChangeEd25519 = (ed25519: string): void => {
    this.setState({ ed25519 });
  }

  private onChangeImOnline = (imOnline: string): void => {
    this.setState({ imOnline });
  }

  private onSessionErrorBabe = (babeError: string | null): void => {
    this.setState({ babeError });
  }

  private onSessionErrorEd25519 = (ed25519Error: string | null): void => {
    this.setState({ ed25519Error });
  }

  private onSessionErrorImOnline = (imOnlineError: string | null): void => {
    this.setState({ imOnlineError });
  }
}

export default withMulti(
  SetSessionKey,
  translate,
  withApi
);
