// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Button, Input, Modal } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

type Props = I18nProps & {
  isOpen: boolean,
  onClose: () => void,
  onNominate: (nominee: string) => void,
  intentions: Array<string>
};

type State = {
  isNomineeValid: boolean,
  isAddressFormatValid: boolean,
  nominee: string
};

class Nominating extends React.PureComponent<Props, State> {
  state: State = {
    isNomineeValid: false,
    isAddressFormatValid: false,
    nominee: ''
  };

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

  renderButtons () {
    const { onClose, t } = this.props;
    const { isNomineeValid } = this.state;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={onClose}
            label={t('Cancel')}
          />
          <Button.Or />
          <Button
            isDisabled={!isNomineeValid}
            isPrimary
            onClick={this.nominate}
            label={t('Nominate')}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  renderContent () {
    const { t } = this.props;
    const { isNomineeValid, nominee } = this.state;

    return (
      <>
        <Modal.Header>
          {t('Nominate Validator')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <Input
            autoFocus
            className='medium'
            isError={!isNomineeValid}
            label={t('nominate the following address (validator or intention)')}
            onChange={this.onChangeNominee}
            value={nominee}
          />
          {this.renderErrors()}
        </Modal.Content>
      </>
    );
  }

  private renderErrors () {
    const { t } = this.props;
    const { isNomineeValid, isAddressFormatValid } = this.state;
    const hasError = !isNomineeValid || !isAddressFormatValid;

    if (!hasError) {
      return null;
    }

    return (
      <article className='error'>
        {
          !isNomineeValid && isAddressFormatValid
            ? t('The address you input is not intending to stake, and is therefore invalid. Please try again with a validator address.')
            : null
        }
        {
          !isAddressFormatValid
            ? t('The address does not conform to a recognized address format. Please make sure you enter a valid address.')
            : null
        }
      </article>
    );
  }

  private onChangeNominee = (nominee: string) => {
    const { intentions } = this.props;

    let isAddressFormatValid = false;

    try {
      keyring.decodeAddress(nominee);

      isAddressFormatValid = true;
    } catch (err) {
      console.error(err);
    }

    this.setState({
      isNomineeValid: intentions.includes(nominee),
      isAddressFormatValid,
      nominee
    });
  }

  private nominate = () => {
    const { onClose, onNominate } = this.props;
    const { nominee } = this.state;

    if (!nominee) {
      onClose();
    } else {
      onNominate(nominee);
    }
  }
}

export default translate(Nominating);
