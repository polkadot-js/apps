// Copyright 2017-2019 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';

import { I18nProps } from '@polkadot/react-components/types';
import { InputNumber, Button, Input, Modal } from '@polkadot/react-components';

import translate from '../translate';

export interface ModalProps {
  onClose: () => void;
  onRegister: (id: BN, name: string) => void;
}

type Props = ModalProps & I18nProps;

interface State {
  assetId: BN;
  name: string;
}

class Create extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    this.state = this.emptyState();
  }

  public render (): React.ReactNode {
    const { t } = this.props;

    return (
      <Modal
        dimmer='inverted'
        open
      >
        <Modal.Header>{t('Register an Asset')}</Modal.Header>
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  private renderButtons (): React.ReactNode {
    const { t } = this.props;
    const { name } = this.state;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={this.onDiscard}
            label={t('Cancel')}
            labelIcon='cancel'
          />
          <Button.Or />
          <Button
            isDisabled={!name}
            isPrimary
            onClick={this.onCommit}
            label={t('Register')}
            labelIcon='registered'
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent (): React.ReactNode {
    const { t } = this.props;
    const { assetId, name } = this.state;

    return (
      <Modal.Content>
        <InputNumber
          help={t('Enter the Asset ID of the token you want to manage.')}
          label={t('asset id')}
          onChange={this.onChangeNewAssetId}
          onEnter={this.onCommit}
          value={assetId}
        />
        <Input
          className='full'
          help={t('Type the name of this Asset. This name will be used across all the apps. It can be edited later on.')}
          isError={!name}
          label={t('name')}
          onChange={this.onChangeName}
          onEnter={this.onCommit}
          value={name}
        />
      </Modal.Content>
    );
  }

  private emptyState (): State {
    return {
      assetId: new BN(0),
      name: 'new asset'
    };
  }

  private onChangeNewAssetId = (assetId: BN | undefined): void => {
    this.setState({ assetId: assetId || new BN(0) });
  }

  private onChangeName = (name: string): void => {
    this.setState({ name });
  }

  private onCommit = (): void => {
    const { onClose, onRegister } = this.props;
    const { assetId, name } = this.state;

    onRegister(assetId, name);
    onClose();
  }

  private onDiscard = (): void => {
    const { onClose } = this.props;

    onClose();
  }
}

export default translate(Create);
