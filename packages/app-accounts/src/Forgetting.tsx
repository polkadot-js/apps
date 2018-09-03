// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/util-keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import Button from '@polkadot/ui-app/Button';
import Input from '@polkadot/ui-app/Input';
import Modal from '@polkadot/ui-app/Modal';
import InputAddress from '@polkadot/ui-app/InputAddress';
import keyring from '@polkadot/ui-keyring/index';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import withObservableBase from '@polkadot/ui-react-rx/with/observableBase';

import AddressSummary from '@polkadot/ui-app/AddressSummary';
import translate from './translate';

type Props = I18nProps & {
  isOpen: boolean,
  onCLose: () => void,
  onForget: () => void
};

type State = {
  current: KeyringPair | null
};

class Forgetting extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);
    this.state = {
      current: ''
    }
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
        style={style}
      >
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  renderButtons () {
    const { onClose, t } = this.props;
    const { current } = this.state;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={onClose}
            text={t('forget.cancel', {
              defaultValue: 'Cancel'
            })}
          />
          <Button.Or />
          <Button
            isPrimary
            onClick={this.doForget}
            text={t('editor.forget', {
              defaultValue: 'Delete'
            })}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  renderContent () {
    const { t } = this.props;
    const { current } = this.state;

    return [
      <Modal.Header key='header'>
        {t('forget.header', {
          defaultValue: 'Forget Validator'
        })}
      </Modal.Header>,
    ];
  }

  private doForget = () => {
    const { onClose, onForget } = this.props;
    const { current } = this.state;
    //use prop of onForget to actually forget it
    onForget();
  }

}

export default Forgetting;
