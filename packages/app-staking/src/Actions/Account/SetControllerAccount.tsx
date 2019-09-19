// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Button, Icon, InputAddress, Modal, TxButton, TxComponent } from '@polkadot/react-components';
import { withCalls, withMulti } from '@polkadot/react-api';

import translate from '../../translate';
import detectUnsafe from '../../unsafeChains';
import InputValidationController from '../Account/InputValidationController';

interface Props extends I18nProps {
  defaultControllerId: string;
  isUnsafeChain?: boolean;
  isValidating?: boolean;
  onClose: () => void;
  stashId: string;
}

interface State {
  controllerError: string | null;
  controllerId: string | null;
}

class SetControllerAccount extends TxComponent<Props, State> {
  public constructor (props: Props) {
    super(props);

    this.state = {
      controllerError: null,
      controllerId: null
    };
  }

  public render (): React.ReactNode {
    const { defaultControllerId, isUnsafeChain, onClose, stashId, t } = this.props;
    const { controllerError, controllerId } = this.state;
    const canSubmit = isUnsafeChain || (!controllerError && !!controllerId && (defaultControllerId !== controllerId));

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
              labelIcon='cancel'
            />
            <Button.Or />
            <TxButton
              accountId={stashId}
              isDisabled={!canSubmit}
              isPrimary
              label={t('Set controller')}
              labelIcon='sign-in'
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

  private renderContent (): React.ReactNode {
    const { defaultControllerId, isUnsafeChain, stashId, t } = this.props;
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
            isError={!isUnsafeChain && !!controllerError}
            label={t('controller account')}
            onChange={this.onChangeController}
            type='account'
            value={controllerId}
          />
          <InputValidationController
            accountId={stashId}
            defaultController={defaultControllerId}
            controllerId={controllerId}
            isUnsafeChain={isUnsafeChain}
            onError={this.onControllerError}
          />
        </Modal.Content>
      </>
    );
  }

  private renderSessionAccountWarning (): React.ReactNode {
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

  private onChangeController = (controllerId: string): void => {
    this.setState({ controllerId });
  }

  private onControllerError = (controllerError: string | null): void => {
    this.setState({ controllerError });
  }
}

export default withMulti(
  SetControllerAccount,
  translate,
  withCalls<Props>(
    ['rpc.system.chain', {
      propName: 'isUnsafeChain',
      transform: detectUnsafe
    }]
  )
);
