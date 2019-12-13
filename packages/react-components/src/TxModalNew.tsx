// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ModalState } from '@polkadot/react-hooks/types';
import { I18nProps, TxModalProps } from './types';

import React from 'react';
import { Button, InputAddress, Modal } from '@polkadot/react-components';
import { useModal } from '@polkadot/react-hooks';
// import { isUndefined } from '@polkadot/util';

import translate from './translate';

interface Props extends I18nProps, TxModalProps {}

function pickModalState<P extends Props> (props: Pick<P, any>): ModalState | null {
  if (props.isOpen && props.onOpen && props.onClose) {
    const { isOpen, onOpen, onClose } = props;
    return { isOpen, onOpen, onClose };
  }
  return null;
}

function TxModal<P extends Props> ({
  t,
  accountId,
  onChangeAccountId,
  sendTx,
  isSending,
  trigger: Trigger,
  header = t('Submit signed extrinsic'),
  children,
  preContent,
  isDisabled = false,
  isSubmittable = true,
  modalProps = {},
  inputAddressExtra,
  inputAddressLabel = t('using my account'),
  inputAddressHelp = t('Select the account to use for this action.'),
  inputAddressProps = {},
  cancelButtonLabel = t('Cancel'),
  submitButtonIcon = 'sign-in',
  submitButtonLabel = t('Submit'),
  submitButtonProps = {},
  ...props
}: P): React.ReactElement<P> | null {
  const {isOpen, onOpen, onClose} = pickModalState(props) || useModal();

  const allModalProps = {
    className: ['ui--Modal', modalProps.className || ''].join(' '),
    dimmer: 'inverted',
    ...modalProps,
    onClose,
    open: isOpen
  };

  return (
    <>
      {Trigger ? <Trigger onOpen={onOpen} /> : null}
      <Modal {...allModalProps}>
        <Modal.Header>
          {header}
        </Modal.Header>
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
        <Modal.Actions>
          <Button.Group>
            <Button
              isNegative
              onClick={onClose}
              label={cancelButtonLabel}
              icon='cancel'
            />
            <Button.Or />
            <Button
              isDisabled={isDisabled || isSending || !accountId || !isSubmittable}
              isPrimary
              label={submitButtonLabel}
              icon={submitButtonIcon}
              onClick={sendTx}
              {...submitButtonProps}
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default translate(TxModal);
