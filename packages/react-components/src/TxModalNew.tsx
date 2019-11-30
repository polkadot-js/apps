// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TxState } from '@polkadot/react-hooks/types';
import { FormProps, TxContent, TxTrigger, TxModalProps as Props } from './types';
import { Button$OnClick } from './Button/types';

import React, { useMemo, useState, useEffect } from 'react';
import { Button, InputAddress, Modal } from '@polkadot/react-components';
import { useForm, useTx } from '@polkadot/react-hooks';
import { isUndefined } from '@polkadot/util';

import translate from './translate';

function renderTrigger (Trigger: TxTrigger, onOpen: () => void): React.ReactNode {
  return Trigger ? <Trigger onOpen={onOpen} /> : null;
}

function renderHeader ({ t, header = t('Submit signed extrinsic') }: Props): React.ReactNode {
  return header;
}

function renderContent (Content: TxContent = (): null => null, contentProps: FormProps & TxState): React.ReactNode {
  return <Content {...contentProps} />;
}

function renderInputAccount ({ t, inputAddressExtra, inputAddressLabel = t('using my account'), inputAddressHelp = t('Select the account to use for this action.'), inputAddressProps = {}, isDisabled }: Props, contentProps: FormProps & TxState): React.ReactNode {
  const { accountId, isSending = false, onChangeAccountId } = contentProps;

  return (
    <InputAddress
      defaultValue={accountId}
      help={inputAddressHelp}
      isDisabled={isDisabled || isSending}
      isInput={false}
      label={inputAddressLabel}
      labelExtra={inputAddressExtra && renderContent(inputAddressExtra, contentProps)}
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

function renderSubmitButton ({ t, submitButtonIcon = 'sign-in', submitButtonLabel = t('Submit'), isDisabled = false, isSubmittable = true, submitButtonProps = {} }: Props, { isSending = false }: TxState, onClick: Button$OnClick): React.ReactNode {
  return (
    <Button
      isLoading={isSending}
      isDisabled={!isSubmittable || isDisabled}
      isPrimary
      label={submitButtonLabel}
      icon={submitButtonIcon}
      onClick={onClick}
      {...submitButtonProps}
    />
  );
}

function TxModal<P extends Props> (props: P): React.ReactElement<P> | null {
  if (!props.extrinsic && (!props.tx || !props.params)) {
    return null;
  }

  const isControlled = !isUndefined(props.isOpen);
  const [isOpen, setIsOpen] = useState(isControlled ? props.isOpen : false);

  const _onOpen = (): void => {
    !isControlled && setIsOpen(true);

    props.onOpen && props.onOpen();
  };

  const _onClose = (): void => {
    !isControlled && setIsOpen(false);

    props.onClose && props.onClose();
  };

  const _onStart = (): void => {
    props.onSubmit && props.onSubmit();
  };

  const _onFailed = (): void => {
    props.onFailed && props.onFailed();
  };

  const _onSuccess = (): void => {
    !isControlled && setIsOpen(false);

    props.onSuccess && props.onSuccess();
  };

  const tx = useMemo(
    (): any => props.extrinsic || [props.tx!, props.params!],
    [props.extrinsic, props.tx, props.params]
  );

  const state = useTx(
    tx,
    {
      accountId: props.accountId,
      onChangeAccountId: props.onChangeAccountId,
      onStart: _onStart,
      onFailed: _onFailed,
      onSuccess: _onSuccess,
    }
  );

  const formProps = useForm(state.sendTx, _onClose);

  useEffect((): void => {
    !isUndefined(props.isOpen) && setIsOpen(props.isOpen);
  }, [props.isOpen]);

  const modalProps = {
    className: ['ui--Modal', (props.modalProps || {}).className].join(' '),
    dimmer: 'inverted',
    ...(props.modalProps || {}),
    onClose: _onClose,
    open: isOpen
  };

  const contentProps = {
    ...formProps,
    ...state
  }

  return (
    <>
      {props.trigger && renderTrigger(props.trigger, _onOpen)}
      <Modal {...modalProps}>
        <Modal.Header>
          {renderHeader(props)}
        </Modal.Header>
        <Modal.Content>
          {renderContent(props.preContent, contentProps)}
          {renderInputAccount(props, contentProps)}
          {renderContent(props.content, contentProps)}
        </Modal.Content>
        <Modal.Actions>
          <Button.Group>
            {renderCancelButton(props, formProps.onCancel)}
            {renderSubmitButton(props, state, formProps.onSubmit)}
          </Button.Group>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default translate(TxModal);
