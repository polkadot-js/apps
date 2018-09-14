// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import Button from '@polkadot/ui-app/Button';
import Input from '@polkadot/ui-app/Input';
import Modal from '@polkadot/ui-app/Modal';

import translate from '../translate';

type Props = I18nProps & {
  isOpen: boolean,
  onClose: () => void,
  onNominate: (nominee: string) => void,
  intentions: Array<string>
};

type State = {
  isNomineeValid: boolean,
  nominee: string
};

class Nominating extends React.PureComponent<Props> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      isNomineeValid: false,
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
    const { isNomineeValid, nominee } = this.state;

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
      </Modal.Content>
    ];
  }

  private onChangeNominee = (nominee: string) => {
    const { intentions } = this.props;

    this.setState({
      isNomineeValid: intentions.includes(nominee),
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
