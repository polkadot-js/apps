// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import Button from '@polkadot/ui-app/Button';
import Modal from '@polkadot/ui-app/Modal';
import translate from './translate';

type Props = I18nProps & {
  isOpen: boolean,
  onClose: () => void,
  doForget: () => void
};

class Forgetting extends React.PureComponent<Props> {
  constructor (props: Props) {
    super(props);
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
    const { onClose, doForget, t } = this.props;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={onClose}
            text={t('forget.close', {
              defaultValue: 'Cancel'
            })}
          />
          <Button.Or />
          <Button
            isPrimary
            onClick={doForget}
            text='Delete'
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  renderContent () {
    const { t } = this.props;
    return [
      <Modal.Header key='header'>
        {t('forget.header', {
          defaultValue: 'Are you sure you want to delete this account?'
        })}
      </Modal.Header>
    ];
  }
}

export default translate(Forgetting);
