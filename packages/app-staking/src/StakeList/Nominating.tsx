// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import Button from '@polkadot/ui-app/Button';
import Input from '@polkadot/ui-app/Input';
import Modal from '@polkadot/ui-app/Modal';
import InputError from '@polkadot/ui-app/InputError';

import translate from '../translate';

import addressDecode from '@polkadot/util-keyring/address/decode';

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

class Nominating extends React.PureComponent<Props> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      isNomineeValid: false,
      isAddressFormatValid: false,
      nominee: ''
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
            text={t('nominators.cancel', {
              defaultValue: 'Cancel'
            })}
          />
          <Button.Or />
          <Button
            isDisabled={!isNomineeValid}
            isPrimary
            onClick={this.nominate}
            text={t('nominator.nominate', {
              defaultValue: 'nominate'
            })}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  renderContent () {
    const { t } = this.props;
    const { isNomineeValid, isAddressFormatValid, nominee } = this.state;

    return [
      <Modal.Header key='header'>
        {t('nominator.header', {
          defaultValue: 'Nominate Validator'
        })}
      </Modal.Header>,
      <Modal.Content className='ui--signer-Signer-Content' key='content'>
        <Input
          className='medium'
          isError={!isNomineeValid}
          label={t('nominator.address', {
            defaultValue: 'nominate the following address (validator or intention)'
          })}
          onChange={this.onChangeNominee}
          value={nominee}
        />
        {
          !isNomineeValid
            ? <InputError
                label={t('nominator.error', {
                  defaultValue: 'The address you input is not intending to stake, and is therefore invalid. \
                                Please try again with a different address.'
                })} />
            : null
        }
        {
          !isAddressFormatValid
            ? <InputError
                label={t('nominator.error', {
                  defaultValue: 'The address you input does not conform to a recognized address format. \
                            Please make sure youve entered the address correctly and try again.'
                })} />
            : null
        }
      </Modal.Content>
    ];
  }

  private onChangeNominee = (nominee: string) => {
    const { intentions } = this.props;
    let publicKey;

    try {
      publicKey = addressDecode(nominee);
    } catch (err) {
      console.error(err);
      this.setState({
        isAddressFormatValid: false
      });
    }

    this.setState({
      isNomineeValid: intentions.includes(nominee),
      isAddressFormatValid: publicKey && publicKey.length === 32,
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
