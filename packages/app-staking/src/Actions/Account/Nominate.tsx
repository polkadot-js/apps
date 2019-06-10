// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';

import React from 'react';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/ui-app';

import translate from '../../translate';

type Props = I18nProps & {
  accountId: string,
  isOpen: boolean,
  nominees?: Array<string>,
  onClose: () => void,
  stashId: string,
  stashOptions: Array<KeyringSectionOption>
};

type State = {
  nominees: Array<string> | undefined
};

class Nominate extends React.PureComponent<Props, State> {
  state: State = {
    nominees: this.props.nominees
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
    const { nominees } = this.state;

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
            isDisabled={!nominees || nominees.length === 0}
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
    const { accountId, stashId, stashOptions, t } = this.props;
    const { nominees } = this.state;

    console.log('Nominate - nominees',nominees);
    return (
      <>
        <Modal.Header>
          {t('Nominate Validators')}
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
          <InputAddress
            className='medium'
            defaultValue={nominees}
            isMultiple
            help={t('Stash accounts that are to be nominated. Block rewards are split between validators and nominators')}
            label={t('nominate the following addresses')}
            onChangeMulti={this.onChangeNominees}
            options={stashOptions}
            placeholder={t('select accounts(s) nominate')}
            type='account'
          />
        </Modal.Content>
      </>
    );
  }

  private onChangeNominees = (newNominees: Array<string>) => {
    const { nominees } = this.state;
    console.log('Nominate - newNominees',newNominees);
    console.log('Nominate - nominees',nominees);
    this.setState({ nominees: newNominees });
  }
}

export default translate(Nominate);
