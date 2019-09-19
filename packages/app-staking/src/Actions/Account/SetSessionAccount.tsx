// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Button, InputAddress, Input, Modal, TxButton } from '@polkadot/react-components';
import { withApi, withMulti } from '@polkadot/react-api';

import ValidationSessionKey from './InputValidationSessionKey';
import translate from '../../translate';

interface Props extends I18nProps, ApiProps {
  controllerId: string;
  isOpen: boolean;
  onClose: () => void;
  sessionIds: string[];
  stashId: string;
}

interface State {
  // TODO remove once we drop v1 support
  ed25519: string | null;
  ed25519Error: string | null;
  keys: string | null;
}

class SetSessionKey extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    this.state = {
      ed25519: props.sessionIds[0] || props.controllerId,
      ed25519Error: null,
      keys: null
    };
  }

  public render (): React.ReactNode {
    const { controllerId, isOpen, isSubstrateV2, onClose, t } = this.props;
    const { ed25519, ed25519Error, keys } = this.state;

    if (!isOpen) {
      return null;
    }

    const hasError = isSubstrateV2
      ? !keys
      : (!ed25519 || !!ed25519Error);

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
              labelIcon='cancel'
            />
            <Button.Or />
            <TxButton
              accountId={controllerId}
              isDisabled={hasError}
              isPrimary
              label={t('Set Session Key')}
              labelIcon='sign-in'
              onClick={onClose}
              params={
                isSubstrateV2
                  ? [keys, new Uint8Array()]
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
    const { controllerId, isSubstrateV2, t } = this.props;

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
          {
            isSubstrateV2
              ? this.renderV2Keys()
              : this.renderV1Keys()
          }
        </Modal.Content>
      </>
    );
  }

  private renderV1Keys (): React.ReactNode {
    const { controllerId, stashId, t } = this.props;
    const { ed25519 } = this.state;

    return (
      <>
        <InputAddress
          className='medium'
          help={t('Changing the key only takes effect at the start of the next session. If validating, it must be an ed25519 key.')}
          label={t('Session key (ed25519)')}
          onChange={this.onChangeEd25519}
          value={ed25519}
        />
        <ValidationSessionKey
          controllerId={controllerId}
          onError={this.onSessionErrorEd25519}
          sessionId={ed25519}
          stashId={stashId}
        />
      </>
    );
  }

  private renderV2Keys (): React.ReactNode {
    const { t } = this.props;
    const { keys } = this.state;

    return (
      <>
        <Input
          className='medium'
          help={t('Changing the key only takes effect at the start of the next session. The input here is generates from the author_rotateKeys command')}
          isError={!keys}
          label={t('Keys from rotateKeys')}
          onChange={this.onChangeKeys}
        />
      </>
    );
  }

  private onChangeEd25519 = (ed25519: string | null): void => {
    this.setState({ ed25519 });
  }

  private onChangeKeys = (keys: string): void => {
    this.setState({ keys: keys || null });
  }

  private onSessionErrorEd25519 = (ed25519Error: string | null): void => {
    this.setState({ ed25519Error });
  }
}

export default withMulti(
  SetSessionKey,
  translate,
  withApi
);
