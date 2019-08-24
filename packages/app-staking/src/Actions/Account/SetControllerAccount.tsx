// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Button, Icon, InputAddress, Modal, TxButton, TxComponent } from '@polkadot/react-components';
import { withCalls, withMulti } from '@polkadot/react-api';
import { Text } from '@polkadot/types';

import translate from '../../translate';
import { NO_VALIDATION_CHAINS } from '../NewStake';
import InputValidationController from '../Account/InputValidationController';

interface Props extends I18nProps {
  defaultControllerId: string;
  isValidating?: boolean;
  onClose: () => void;
  stashId: string;
  systemChain?: Text;
}

interface State {
  controllerError: string | null;
  controllerId: string | null;
  ignoreController: boolean;
}

class SetControllerAccount extends TxComponent<Props, State> {
  public constructor (props: Props) {
    super(props);

    this.state = {
      controllerError: null,
      controllerId: null,
      ignoreController: false
    };
  }

  public static getDerivedStateFromProps ({ systemChain }: Props): Pick<State, any> | null {
    if (!systemChain) {
      return null;
    }

    return {
      ignoreController: NO_VALIDATION_CHAINS.includes(systemChain.toString())
    };
  }

  public render (): React.ReactNode {
    const { defaultControllerId, onClose, stashId, t } = this.props;
    const { controllerError, controllerId, ignoreController } = this.state;
    const canSubmit = ignoreController || (!controllerError && !!controllerId && (defaultControllerId !== controllerId));

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

  private renderContent (): React.ReactNode {
    const { defaultControllerId, stashId, t } = this.props;
    const { controllerId, controllerError, ignoreController } = this.state;

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
            isError={!ignoreController && !!controllerError}
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
    ['rpc.system.chain', { propName: 'systemChain' }]
  )
);
