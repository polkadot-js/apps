// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StringOrNull, TxModalProps as Props } from '@polkadot/react-components/types';

import React, { useState, useEffect } from 'react';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { isUndefined } from '@polkadot/util';

import translate from './translate';

function renderTrigger ({ trigger: Trigger }: Props, onOpen: () => void): React.ReactNode {
  return Trigger ? <Trigger onOpen={onOpen} /> : null;
}

function renderHeader ({ t, header = t('Submit signed extrinsic') }: Props): React.ReactNode {
  return header;
}

function renderPreContent ({ preContent = null }: Props): React.ReactNode {
  return preContent;
}

function renderContent ({ content = null }: Props): React.ReactNode {
  return content;
}

function renderInputAccount ({ t, inputAddressLabel = t('using my account'), inputAddressHelp = t('Select the account to use for this action.'), inputAddressProps = {}, isDisabled }: Props, accountId: string | null, onChangeAccountId: (_: string | null) => void, isBusy = false) {
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

function renderCancelButton ({ t, cancelButtonLabel = t('Cancel') }: Props, onClose: () => void): React.ReactNode {
  return (
    <>
      <Button
        isNegative
        onClick={onClose}
        label={cancelButtonLabel}
        icon='cancel'
      />
      <Button.Or />
    </>
  );
}

function renderSubmitButton ({ t, extrinsic, submitButtonLabel = t('Submit'), submitButtonRef, isDisabled = false, isUnsigned = false, isSubmittable = true, method, params }: Props, accountId: string | null, onSubmit: () => void, onSuccess: () => void, onFailed: () => void, submitButtonProps = {}): React.ReactNode {  
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
      onClick={onSubmit}
      onFailed={onFailed}
      onSuccess={onSuccess}
      params={params}
      innerRef={submitButtonRef}
      tx={method}
      {...submitButtonProps}
    />
  )
}


function TxModal<P extends Props> (props: P): React.ReactElement<P> {
  const isControlled = !isUndefined(props.isOpen);
  const isFixedAccount = !isUndefined(props.accountId);

  const [accountId, setAccountId] = useState<StringOrNull>(isFixedAccount ? props.accountId! : null);
  const [isBusy, setIsBusy] = useState(false);
  const [isOpen, setIsOpen] = useState(isControlled ? props.isOpen : false);

  const _onChangeAccountId = (accountId: StringOrNull): void => {
    setAccountId(accountId);

    props.onChangeAccountId && props.onChangeAccountId(accountId);
  }

  const _onOpen = (): void => {
    !isControlled && setIsOpen(true);

    props.onOpen && props.onOpen();
  }

  const _onClose = (): void => {
    !isControlled && setIsOpen(false);
    
    props.onClose && props.onClose();
  }

  const _onSubmit = (): void => {
    setIsBusy(true);

    props.onSubmit && props.onSubmit();
  }

  const _onFailed = (): void => {
    setIsBusy(false);

    props.onFailed && props.onFailed();
  }

  const _onSuccess = (): void => {
    setIsBusy(false);
    !isControlled && setIsOpen(false);

    props.onSuccess && props.onSuccess();
  }

  useEffect((): void => {
    !isUndefined(props.isOpen) && setIsOpen(props.isOpen);
  }, [props.isOpen])

  useEffect((): void => {
    !isUndefined(props.accountId) && setAccountId(props.accountId);
  }, [props.accountId])

  const modalProps = {
    className: ['ui--Modal', (props.modalProps || {}).className].join(' '),
    dimmer: 'inverted',
    ...(props.modalProps || {}),
    onClose: _onClose,
    open: isOpen
  };

  return (
    <>
      {props.trigger && renderTrigger(props, _onOpen)}
      <Modal {...modalProps}>
        <Modal.Header>
          {renderHeader(props)}
        </Modal.Header>
        <Modal.Content>
          {renderPreContent(props)}
          {renderInputAccount(props, accountId, _onChangeAccountId, isBusy)}
          {renderContent(props)}
        </Modal.Content>
        <Modal.Actions>
          <Button.Group>
            {renderCancelButton(props, _onClose)}
            {renderSubmitButton(props, accountId, _onSubmit, _onSuccess, _onFailed)}
          </Button.Group>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default translate(TxModal);

// class TxModal2<P extends TxModalProps, S extends TxModalState> extends <P, S> {
//   protected defaultState: S = {
//     accountId: null,
//     isOpen: false,
//     isBusy: false
//   } as unknown as S;

//   public state: S = this.defaultState;

//   public render (): React.ReactNode {
//     const { isOpen } = this.state;

//     return (
//       <>
//         {this.renderTrigger && this.renderTrigger()}
//         <Modal
//           className='ui--Modal'
//           dimmer='inverted'
//           onClose={this.hideModal}
//           open={isOpen}
//         >
//           <Modal.Header>
//             {this.headerText()}
//           </Modal.Header>
//           <Modal.Content>
//             {this.renderPreContent()}
//             {this.renderInputAccount()}
//             {this.renderContent()}
//           </Modal.Content>
//           <Modal.Actions>
//             {this.renderButtons()}
//           </Modal.Actions>
//         </Modal>
//       </>
//     );
//   }


//   protected accountHelp = (): React.ReactNode => this.props.t('Select the account to use for this action.');

//   protected accountLabel = (): React.ReactNode => this.props.t('using my account');

//   protected submitLabel = (): React.ReactNode => this.props.t('Submit');

//   protected cancelLabel = (): React.ReactNode => this.props.t('Cancel');

//   protected onChangeAccount = (accountId: string | null): void => {
//     this.setState({ accountId });
//   }

//   protected onSubmit = (): void => {
//     const { onSubmit } = this.props;

//     this.toggleBusy(true);
//     onSubmit && onSubmit();
//   }

//   protected onSuccess = (): void => {
//     const { onClose, onSuccess } = this.props;

//     onSuccess && onSuccess();
//     onClose && onClose();
//     this.hideModal();
//   }

//   protected onFailed = (): void => {
//     const { onFailed } = this.props;

//     this.toggleBusy(false);
//     onFailed && onFailed();
//   }

//   protected isDisabled = (): boolean => {
//     const { accountId } = this.state;

//     return !accountId;
//   }

//   protected toggleBusy = (isBusy: boolean): () => void =>
//     (): void => {
//       this.setState({
//         isBusy
//       });
//     }

//   protected isUnsigned: () => boolean = (): boolean => false;

//   protected txMethod: () => string = (): string => '';

//   protected txParams: () => any[] = (): any[] => [];

//   protected renderContent: () => React.ReactNode = (): React.ReactNode => null;

//   protected renderPreContent: () => React.ReactNode = (): React.ReactNode => null;

//   protected renderTrigger?: () => React.ReactNode = (): React.ReactNode => null;

//   protected renderButtons: () => React.ReactNode = (): React.ReactNode => {
//     return (
//       <Button.Group>
//         {this.renderCancelButton()}
//         {this.renderTxButton()}
//       </Button.Group>
//     );
//   }

//   protected renderInputAccount (): React.ReactNode {
//     const { accountId, isBusy } = this.state;

//     return (
//       <InputAddress
//         defaultValue={accountId}
//         help={this.accountHelp()}
//         isDisabled={isBusy}
//         isInput={false}
//         label={this.accountLabel()}
//         onChange={this.onChangeAccount}
//         type='account'
//         value={accountId}
//       />
//     );
//   }

//   protected renderTxButton (): React.ReactNode {
//     const { accountId } = this.state;

//     return (
//       <TxButton
//         {...(
//           this.isUnsigned()
//             ? { isUnsigned: true }
//             : { accountId }
//         )}
//         isDisabled={this.isDisabled()}
//         isPrimary
//         label={this.submitLabel()}
//         icon='sign-in'
//         onClick={this.onSubmit}
//         onFailed={this.onFailed}
//         onSuccess={this.onSuccess}
//         params={this.txParams()}
//         ref={this.button}
//         tx={this.txMethod()}
//       />
//     );
//   }

//   protected renderCancelButton (): React.ReactNode {
//     const { t } = this.props;

//     return (
//       <>
//         <Button
//           isNegative
//           onClick={this.hideModal}
//           label={t('Cancel')}
//           icon='cancel'
//         />
//         <Button.Or />
//       </>
//     );
//   }

//   protected reset = (): void => {
//     this.setState(
//       this.defaultState
//     );
//   }

//   protected showModal = (): void => {
//     this.setState({
//       isOpen: true
//     });
//   }

//   protected hideModal = (): void => {
//     const { onClose } = this.props;

//     onClose && onClose();

//     this.setState(
//       this.defaultState
//     );
//   }
// }
