// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import Button from '@polkadot/ui-app/Button';
import Modal from '@polkadot/ui-app/Modal';

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
    const { onClose, doForget } = this.props;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={onClose}
            text='Cancel'
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

    return [
      <Modal.Header key='header'>
        Are you sure you want to delete this account?
      </Modal.Header>
    ];
  }
}

export default Forgetting;
