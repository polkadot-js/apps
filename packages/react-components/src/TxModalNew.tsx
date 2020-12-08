// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TxModalProps as Props } from './types';

import React, { useEffect, useState } from 'react';

import { Button, InputAddress, Modal } from '@polkadot/react-components';
// import { useTx } from '@polkadot/react-hooks';
import { isUndefined } from '@polkadot/util';

import translate from './translate';

function TxModal<P extends Props> ({ t, accountId, onChangeAccountId, sendTx, isSending, trigger: Trigger, header = t<string>('Submit signed extrinsic'), children, preContent, isDisabled = false, isSubmittable = true, modalProps = {}, inputAddressExtra, inputAddressLabel = t<string>('using my account'), inputAddressHelp = t<string>('Select the account to use for this action.'), inputAddressProps = {}, submitButtonIcon = 'sign-in-alt', submitButtonLabel = t<string>('Submit'), submitButtonProps = {}, ...props }: P): React.ReactElement<P> | null {
  const isControlled = !isUndefined(props.isOpen);
  const [isOpen, setIsOpen] = useState(isControlled ? props.isOpen : false);

  const onOpen = (): void => {
    !isControlled && setIsOpen(true);

    props.onOpen && props.onOpen();
  };

  const onClose = (): void => {
    !isControlled && setIsOpen(false);

    props.onClose && props.onClose();
  };

  const onSend = (): void => {
    sendTx();
    onClose();
  };

  useEffect((): void => {
    !isUndefined(props.isOpen) && setIsOpen(props.isOpen);
  }, [props.isOpen]);

  const allModalProps = {
    className: ['ui--Modal', modalProps.className || ''].join(' '),
    dimmer: 'inverted',
    header,
    ...modalProps,
    onClose,
    open: isOpen
  };

  return (
    <>
      {Trigger && <Trigger onOpen={onOpen} />}
      <Modal {...allModalProps}>
        <Modal.Content>
          {preContent}
          <InputAddress
            defaultValue={accountId}
            help={inputAddressHelp}
            isDisabled={isDisabled || isSending}
            isInput={false}
            label={inputAddressLabel}
            labelExtra={inputAddressExtra}
            onChange={onChangeAccountId}
            type='account'
            {...inputAddressProps}
          />
          {children}
        </Modal.Content>
        <Modal.Actions onCancel={onClose}>
          <Button
            icon={submitButtonIcon}
            isDisabled={isDisabled || isSending || !accountId || !isSubmittable}
            label={submitButtonLabel}
            onClick={onSend}
            {...submitButtonProps}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default translate(TxModal);
