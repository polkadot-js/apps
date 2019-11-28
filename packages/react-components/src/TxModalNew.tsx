// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StringOrNull, FormProps, TxContent, TxTrigger, TxModalProps as Props } from './types';
import { Button$OnClick } from './Button/types';

import React, { useState, useEffect } from 'react';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useForm } from '@polkadot/react-hooks';
import { isUndefined } from '@polkadot/util';

import translate from './translate';

function renderTrigger (Trigger: TxTrigger, onOpen: () => void): React.ReactNode {
  return Trigger ? <Trigger onOpen={onOpen} /> : null;
}

function renderHeader ({ t, header = t('Submit signed extrinsic') }: Props): React.ReactNode {
  return header;
}

function renderContent (Content: TxContent = (): null => null, hooks: FormProps): React.ReactNode {
  return <Content {...hooks} />;
}

function renderInputAccount ({ t, inputAddressLabel = t('using my account'), inputAddressHelp = t('Select the account to use for this action.'), inputAddressProps = {}, isDisabled }: Props, accountId: string | null, onChangeAccountId: (_: string | null) => void, isBusy = false): React.ReactNode {
  return (
    <InputAddress
      defaultValue={accountId}
      help={inputAddressHelp}
      isDisabled={isDisabled || isBusy}
      isInput={false}
      label={inputAddressLabel}
      onChange={onChangeAccountId}
      type='account'
      value={accountId}
      {...inputAddressProps}
    />
  );
}

function renderCancelButton ({ t, cancelButtonLabel = t('Cancel') }: Props, onClick: Button$OnClick): React.ReactNode {
  return (
    <>
      <Button
        isNegative
        onClick={onClick}
        label={cancelButtonLabel}
        icon='cancel'
      />
      <Button.Or />
    </>
  );
}

function renderSubmitButton ({ t, extrinsic, submitButtonLabel = t('Submit'), isDisabled = false, isUnsigned = false, isSubmittable = true, tx, params }: Props, onClick: Button$OnClick, accountId: string | null, onSuccess: () => void, onFailed: () => void, submitButtonProps = {}): React.ReactNode {
  return (
    <TxButton
      {...(
        isUnsigned
          ? { isUnsigned: true }
          : { accountId }
      )}
      extrinsic={extrinsic}
      isDisabled={!isSubmittable || isDisabled}
      isPrimary
      label={submitButtonLabel}
      icon='sign-in'
      onClick={onClick}
      onFailed={onFailed}
      onSuccess={onSuccess}
      params={params}
      tx={tx}
      {...submitButtonProps}
    />
  );
}

function TxModal<P extends Props> (props: P): React.ReactElement<P> {
  const isControlled = !isUndefined(props.isOpen);
  const isFixedAccount = !isUndefined(props.accountId);

  const [accountId, setAccountId] = useState<StringOrNull>(isFixedAccount ? props.accountId || null : null);
  const [isBusy, setIsBusy] = useState(false);
  const [isOpen, setIsOpen] = useState(isControlled ? props.isOpen : false);

  const _onChangeAccountId = (accountId: StringOrNull): void => {
    setAccountId(accountId);

    props.onChangeAccountId && props.onChangeAccountId(accountId);
  };

  const _onOpen = (): void => {
    !isControlled && setIsOpen(true);

    props.onOpen && props.onOpen();
  };

  const _onClose = (): void => {
    !isControlled && setIsOpen(false);

    props.onClose && props.onClose();
  };

  const _onSubmit = (): void => {
    setIsBusy(true);

    props.onSubmit && props.onSubmit();
  };

  const _onFailed = (): void => {
    setIsBusy(false);

    props.onFailed && props.onFailed();
  };

  const _onSuccess = (): void => {
    setIsBusy(false);
    !isControlled && setIsOpen(false);

    props.onSuccess && props.onSuccess();
  };

  const formProps = useForm(_onSubmit, _onClose);

  useEffect((): void => {
    !isUndefined(props.isOpen) && setIsOpen(props.isOpen);
  }, [props.isOpen]);

  useEffect((): void => {
    !isUndefined(props.accountId) && setAccountId(props.accountId);
  }, [props.accountId]);

  const modalProps = {
    className: ['ui--Modal', (props.modalProps || {}).className].join(' '),
    dimmer: 'inverted',
    ...(props.modalProps || {}),
    onClose: _onClose,
    open: isOpen
  };

  return (
    <>
      {props.trigger && renderTrigger(props.trigger, _onOpen)}
      <Modal {...modalProps}>
        <Modal.Header>
          {renderHeader(props)}
        </Modal.Header>
        <Modal.Content>
          {renderContent(props.preContent, formProps)}
          {renderInputAccount(props, accountId, _onChangeAccountId, isBusy)}
          {renderContent(props.content, formProps)}
        </Modal.Content>
        <Modal.Actions>
          <Button.Group>
            {renderCancelButton(props, formProps.onCancel)}
            {renderSubmitButton(props, formProps.onSubmit, accountId, _onSuccess, _onFailed)}
          </Button.Group>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default translate(TxModal);
