// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { CodeStored } from '@polkadot/app-contracts/types';

import React from 'react';
import { Button, CodeRow, Modal } from '@polkadot/react-components';

import translate from './translate';

interface Props extends I18nProps {
  code: CodeStored;
  onClose: () => void;
  onRemove: () => void;
}

class RemoveABI extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { onClose, t } = this.props;
    return (
      <Modal
        className='app--accounts-Modal'
        dimmer='inverted'
        onClose={onClose}
        open
      >
        <Modal.Header>
          {t('Confirm ABI removal')}
        </Modal.Header>
        <Modal.Content>
          {this.renderContent()}
        </Modal.Content>
        {this.renderButtons()}
      </Modal>
    );
  }

  private content = (): React.ReactNode => {
    const { t } = this.props;

    return (
      <>
        <p>{t('You are about to remove this code\'s ABI. Once completed, should you need to access it again, you will have to manually re-upload it.')}</p>
        <p>{t('This operaion does not impact the associated on-chain code or any of its contracts.')}</p>
      </>
    );
  }

  private renderButtons (): React.ReactNode {
    const { onClose, t } = this.props;

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
            isPrimary
            onClick={this.onRemove}
            label={t('Remove')}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent (): React.ReactNode {
    const { code } = this.props;

    return (
      <CodeRow
        code={code}
        isInline
      >
        {this.content()}
      </CodeRow>
    );
  }

  private onRemove = (): void => {
    const { onClose, onRemove } = this.props;

    onClose && onClose();
    onRemove();
  }
}

export default translate(RemoveABI);
