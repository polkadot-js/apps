// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Button, Icon, InputAddress, Modal, TxButton, TxComponent } from '@polkadot/ui-app';
import { withMulti } from '@polkadot/ui-api';

import translate from '../../translate';
import InputValidationController from '../Account/InputValidationController';

type Props = I18nProps & {
  defaultControllerId: string,
  isValidating?: boolean,
  onClose: () => void,
  stashId: string
};

type State = {
  controllerError: string | null,
  controllerId: string | null
};

class SetControllerAccount extends TxComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      controllerError: null,
      controllerId: null
    };
  }

  render () {
    const { defaultControllerId, onClose, stashId, t } = this.props;
    const { controllerError, controllerId } = this.state;
    const canSubmit = !controllerError && !!controllerId && (defaultControllerId !== controllerId);

    return (
      <Modal
        className='staking--SetControllerAccount'
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
              accountId={stashId}
              isDisabled={!canSubmit}
              isPrimary
              label={t('Set controller')}
              onClick={onClose}
              params={[controllerId]}
              tx='staking.setController'
              ref={this.button}
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent () {
    const { defaultControllerId, stashId, t } = this.props;
    const { controllerId, controllerError } = this.state;

    return (
      <>
        <Modal.Header>
          {t('Change controller account')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          {this.renderSessionAccountWarning()}
          <InputAddress
            className='medium'
            isDisabled
            label={t('stash account')}
            value={stashId}
          />
          <InputAddress
            className='medium'
            defaultValue={defaultControllerId}
            help={t('The controller is the account that will be used to control any nominating or validating actions. Should not match another stash or controller.')}
            isError={!!controllerError}
            label={t('controller account')}
            onChange={this.onChangeController}
            type='account'
            value={controllerId}
          />
          <InputValidationController
            accountId={stashId}
            defaultController={defaultControllerId}
            controllerId={controllerId}
            onError={this.onControllerError}
          />
        </Modal.Content>
      </>
    );
  }

  private renderSessionAccountWarning () {
    const { isValidating = false, t } = this.props;

    if (!isValidating) {
      return null;
    }

    return (
      <article className='warning'>
        <div className='warning'>
          <Icon name='warning sign' />
          {t('Warning - Changing the controller while validating will modify the associated session account. It is advised to stop validating before changing the controller account.')}
        </div>
      </article>
    );
  }
  private onChangeController = (controllerId: string) => {
    this.setState({ controllerId });
  }

  private onControllerError = (controllerError: string | null) => {
    this.setState({ controllerError });
  }
}

export default withMulti(
  SetControllerAccount,
  translate
);
