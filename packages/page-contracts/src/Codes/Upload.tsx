// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';
import { StringOrNull } from '@polkadot/react-components/types';

import React, { useCallback, useMemo, useState } from 'react';
import { SubmittableResult } from '@polkadot/api';
import { Button, InputFile, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { compactAddLength, isNull } from '@polkadot/util';
import { ABI, InputAccount, InputName } from '../shared';

// import ContractModal, { ContractModalProps, ContractModalState } from '../Modal';
import store from '../store';
import { useTranslation } from '../translate';
import useAbi from '../useAbi';

// interface Props {
//   basePath: string;
//   isNew?: boolean;
// }

// interface State extends ContractModalState {
//   gasLimit: BN;
//   isWasmValid: boolean;
//   wasm?: Uint8Array | null;
// }

export default function Upload (): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleIsOpen] = useToggle();
  const [accountId, setAccountId] = useState<StringOrNull>(null);
  const [[wasm, isWasmValid], setWasm] = useState<[Uint8Array | null, boolean]>([null, false]);
  const [name, setName] = useState<StringOrNull>(null);
  const { abi, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi();

  // const [[abi, contractAbi, isAbiSupplied, isAbiValid], setAbi] = useState<[StringOrNull | undefined, Abi | null | undefined, boolean, boolean]>([undefined, undefined, false, false]);
  // const [gasLimit, setGasLimit] = useState<BN | undefined>(new BN(GAS_LIMIT));

  const isNameValid = useMemo(
    (): boolean => !isNull(name) && name.length > 0,
    [name]
  );

  // const isGasLimitValid = useMemo(
  //   (): boolean => !gasLimit?.isZero(),
  //   [gasLimit]
  // );

  const isSubmittable = useMemo(
    (): boolean => !!accountId && (!isNull(name) && isNameValid) && isWasmValid && (!isAbiSupplied || isAbiValid),
    [accountId, name, isAbiSupplied, isAbiValid, isNameValid, isWasmValid]
  );

  const _onAddWasm = useCallback(
    (wasm: Uint8Array, name: string): void => {
      setWasm([compactAddLength(wasm), wasm.subarray(0, 4).toString() === '0,97,115,109']);
      setName(name);
    },
    []
  );

  // const _onAddAbi = useCallback(
  //   (abi: string | null | undefined, contractAbi: Abi | null = null, isAbiSupplied = false): void => {
  //     setAbi([abi, contractAbi, isAbiSupplied, !!abi]);
  //   },
  //   []
  // );

  const _onSuccess = useCallback(
    (result: SubmittableResult): void => {
      const section = api.tx.contracts ? 'contracts' : 'contract';
      const record = result.findRecord(section, 'CodeStored');

      if (record) {
        const codeHash = record.event.data[0];

        if (!codeHash || !name) {
          return;
        }

        store.saveCode(codeHash as Hash, { abi: JSON.stringify(abi), name, tags: [] })
          .then()
          .catch((error: any): void => {
            console.error('Unable to save code', error);
          });
      }
    },
    [api, abi, name]
  );

  return (
    <>
      <Button
        icon='add'
        label={t('Upload WASM')}
        onClick={toggleIsOpen}
      />
      {isOpen && (
        <Modal header={t('Upload WASM')}>
          <Modal.Content>
            <InputAccount
              onChange={setAccountId}
              value={accountId || undefined}
            />
            <InputFile
              help={t('The compiled WASM for the contract that you wish to deploy. Each unique code blob will be attached with a code hash that can be used to create new instances.')}
              isError={!isWasmValid}
              label={t('compiled contract WASM')}
              onChange={_onAddWasm}
              placeholder={
                wasm && !isWasmValid
                  ? t('The code is not recognized as being in valid WASM format')
                  : null
              }
            />
            <InputName
              isError={!isNameValid}
              onChange={setName}
              value={name || undefined}
            />
            <ABI
              contractAbi={contractAbi}
              errorText={errorText}
              isError={isAbiError}
              isSupplied={isAbiSupplied}
              isValid={isAbiValid}
              onChange={onChangeAbi}
              onRemove={onRemoveAbi}
              withLabel
            />
            {/* <InputGas
              isError={!isGasLimitValid}
              onChange={setGasLimit}
              value={gasLimit}
            /> */}
          </Modal.Content>
          <Modal.Actions onCancel={toggleIsOpen}>
            <TxButton
              accountId={accountId}
              icon='upload'
              isDisabled={!isSubmittable}
              label={t('Upload')}
              onClick={toggleIsOpen}
              onSuccess={_onSuccess}
              params={[wasm]}
              tx={api.tx.contracts ? 'contracts.putCode' : 'contract.putCode'}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

// class Upload2 extends ContractModal<Props, State> {
//   constructor (props: Props) {
//     super(props);

//     this.defaultState = {
//       ...this.defaultState,
//       gasLimit: new BN(GAS_LIMIT),
//       isWasmValid: false,
//       wasm: null
//     };
//     this.state = this.defaultState;
//     this.headerText = props.t('Upload WASM');
//   }

//   protected renderContent = (): React.ReactNode => {
//     const { t } = this.props;
//     const { isBusy, isWasmValid, wasm } = this.state;

//     return (
//       <>
//         {this.renderInputAccount()}
//         <InputFile
//           help={t('The compiled WASM for the contract that you wish to deploy. Each unique code blob will be attached with a code hash that can be used to create new instances.')}
//           isDisabled={isBusy}
//           isError={!isWasmValid}
//           label={t('compiled contract WASM')}
//           onChange={this.onAddWasm}
//           placeholder={
//             wasm && !isWasmValid
//               ? t('The code is not recognized as being in valid WASM format')
//               : null
//           }
//         />
//         {this.renderInputName()}
//         {this.renderInputAbi()}
//         {this.renderInputGas()}
//       </>
//     );
//   }

//   protected renderButtons = (): React.ReactNode => {
//     const { api, t } = this.props;
//     const { accountId, gasLimit, isBusy, isNameValid, isWasmValid, wasm } = this.state;
//     const isValid = !isBusy && accountId && isNameValid && isWasmValid && !gasLimit.isZero() && !!accountId;

//     return (
//       <TxButton
//         accountId={accountId}
//         icon='upload'
//         isDisabled={!isValid}
//         isPrimary
//         label={t('Upload')}
//         onClick={this.toggleBusy(true)}
//         onFailed={this.toggleBusy(false)}
//         onSuccess={this.onSuccess}
//         params={[gasLimit, wasm]}
//         tx={api.tx.contracts ? 'contracts.putCode' : 'contract.putCode'}
//         withSpinner
//       />
//     );
//   }

//   private onAddWasm = (wasm: Uint8Array, name: string): void => {
//     this.setState({
//       isWasmValid: wasm.subarray(0, 4).toString() === '0,97,115,109', // '\0asm'
//       wasm: compactAddLength(wasm)
//     });
//     this.onChangeName(name);
//   }

//   private onSuccess = (result: SubmittableResult): void => {
//     const { api } = this.props;

//     this.setState(({ abi, name, tags }): Pick<State, never> | null => {
//       const section = api.tx.contracts ? 'contracts' : 'contract';
//       const record = result.findRecord(section, 'CodeStored');

//       if (record) {
//         const codeHash = record.event.data[0];

//         if (!codeHash || !name) {
//           return null;
//         }

//         store.saveCode(codeHash as Hash, { abi, name, tags })
//           .then((): void => this.onClose())
//           .catch((error: any): void => {
//             console.error('Unable to save code', error);
//           });
//       }

//       return { isBusy: false };
//     });
//   }
// }

// export default withMulti(
//   Upload,
//   translate,
//   withApi
// );
