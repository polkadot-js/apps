// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { ValidatorPrefs } from '@polkadot/types';
import { withCall, withMulti } from '@polkadot/ui-api/index';
import { Button, InputNumber, Modal } from '@polkadot/ui-app/index';

import translate from '../translate';

type Props = I18nProps & {
  accountId: string,
  isOpen: boolean,
  onClose: () => void,
  onSetPrefs: (prefs: ValidatorPrefs) => void,
  staking_validatorPreferences?: ValidatorPrefs
};

type State = {
  unstakeThreshold?: BN,
  validatorPayment?: BN
};

class Preferences extends React.PureComponent<Props, State> {
  state: State = {};

  // inject the preferences are returned via RPC once into the state (from this
  // point forward it will be entirely managed by the actual inputs)
  static getDerivedStateFromProps (props: Props, state: State): State | null {
    if (state.unstakeThreshold || !props.staking_validatorPreferences) {
      return null;
    }

    const { unstakeThreshold, validatorPayment } = props.staking_validatorPreferences;

    return {
      unstakeThreshold: unstakeThreshold.toBn(),
      validatorPayment: validatorPayment.toBn()
    };
  }

  render () {
    const { isOpen, style } = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--Nominating'
        dimmer='inverted'
        open
        size='small'
        style={style}
      >
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  private renderButtons () {
    const { onClose, t } = this.props;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={onClose}
            text={t('Cancel')}
          />
          <Button.Or />
          <Button
            isPrimary
            onClick={this.setPrefs}
            text={t('Set Prefs')}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent () {
    const { t } = this.props;
    const { unstakeThreshold, validatorPayment } = this.state;

    return (
      <>
        <Modal.Header>
          {t('Validator Preferences')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputNumber
            bitLength={32}
            className='medium'
            label={t('unstake threshold')}
            onChange={this.onChangeThreshold}
            value={
              unstakeThreshold
                ? unstakeThreshold.toString()
                : '0'
            }
          />
          <InputNumber
            bitLength={128}
            className='medium'
            isSi
            label={t('payment preferences')}
            onChange={this.onChangePayment}
            value={
              validatorPayment
                ? validatorPayment.toString()
                : '0'
            }
          />
        </Modal.Content>
      </>
    );
  }

  private onChangePayment = (validatorPayment?: BN) => {
    if (validatorPayment) {
      this.setState({ validatorPayment });
    }
  }

  private onChangeThreshold = (unstakeThreshold?: BN) => {
    if (unstakeThreshold) {
      this.setState({ unstakeThreshold });
    }
  }

  private setPrefs = () => {
    const { onSetPrefs } = this.props;
    const { unstakeThreshold, validatorPayment } = this.state;

    onSetPrefs(new ValidatorPrefs({
      unstakeThreshold,
      validatorPayment
    }));
  }
}

export default withMulti(
  Preferences,
  translate,
  withCall('query.staking.validatorPreferences', { paramName: 'accountId' })
);
