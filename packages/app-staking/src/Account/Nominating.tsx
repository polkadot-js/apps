// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Button, Input, InputAddress, Modal, TxButton } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

type Props = I18nProps & {
  accountId: string,
  isOpen: boolean,
  onClose: () => void,
  intentions: Array<string>,
  stashId: string
};

type State = {
  isNomineeValid: boolean,
  isAddressFormatValid: boolean,
  nominees: Array<string>
};

class Nominating extends React.PureComponent<Props, State> {
  state: State = {
    isNomineeValid: false,
    isAddressFormatValid: false,
    nominees: []
  };

  render () {
    const { isOpen } = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--Nominating'
        dimmer='inverted'
        open
        size='small'
      >
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  renderButtons () {
    const { accountId, onClose, t } = this.props;
    const { isNomineeValid, nominees } = this.state;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={onClose}
            label={t('Cancel')}
          />
          <Button.Or />
          <TxButton
            accountId={accountId}
            isDisabled={!isNomineeValid || !nominees.length}
            isPrimary
            onClick={onClose}
            params={[nominees]}
            label={t('Nominate')}
            tx='staking.nominate'
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  renderContent () {
    const { accountId, stashId, t } = this.props;
    const { isNomineeValid, nominees } = this.state;

    return (
      <>
        <Modal.Header>
          {t('Nominate Validator')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            defaultValue={accountId}
            isDisabled
            label={t('controller account')}
          />
          <InputAddress
            className='medium'
            defaultValue={stashId}
            isDisabled
            label={t('stash account')}
          />
          <Input
            autoFocus
            className='medium'
            isError={!isNomineeValid}
            label={t('nominate the following address (validator or intention)')}
            onChange={this.onChangeNominee}
            value={nominees[0]}
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
    // const { intentions } = this.props;

    let isAddressFormatValid = false;

    try {
      keyring.decodeAddress(nominee);

      isAddressFormatValid = true;
    } catch (err) {
      console.error(err);
    }

    this.setState({
      isNomineeValid: isAddressFormatValid, // intentions.includes(nominee),
      isAddressFormatValid,
      nominees: [nominee]
    });
  }
}

export default translate(Nominating);
