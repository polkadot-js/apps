// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIFnArg } from '@polkadot/api-contract/types';
import { AccountId } from '@polkadot/types/interfaces';
import { StringOrNull, VoidFn } from '@polkadot/react-components/types';
import { CodeStored } from './types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { SubmittableResult } from '@polkadot/api';
import keyring from '@polkadot/ui-keyring';
import { Dropdown, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useFormField, useNonEmptyString, useNonZeroBn, useApi } from '@polkadot/react-hooks';
import createValues from '@polkadot/react-params/values';
import keyring from '@polkadot/ui-keyring';
import { isFunction } from '@polkadot/util';

import { ABI, InputAccount, InputGas, InputName, MessageSignature, Params } from './shared';
import store from './store';
import { useTranslation } from './translate';
import useAbi from './useAbi';
import { ENDOWMENT, GAS_LIMIT } from './constants';

type CodeOptions = { text: string; value: string }[];
type ConstructOptions = { key: string; text: React.ReactNode; value: string }[];

interface Props {
  basePath: string;
  allCodes: CodeStored[];
  codeHash: string;
  constructorIndex?: number;
  isOpen?: boolean;
  onClose: VoidFn;
  setCodeHash: React.Dispatch<string>;
  setConstructorIndex: React.Dispatch<number>;
}

// interface State {
//   codeHash: string;
//   constructorIndex: number;
//   constructOptions: ConstructOptions;
//   endowment: BN;
//   isHashValid: boolean;
//   params: any[];
// }

function defaultContractName (name: string) {
  return `${name} (instance)`;
}

function Deploy ({ allCodes, basePath, codeHash, constructorIndex = 0, isOpen, onClose, setCodeHash, setConstructorIndex }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const history = useHistory();

  const code = useMemo(
    (): CodeStored => store.getCode(codeHash),
    [codeHash]
  );
  const [accountId, isAccountIdValid, setAccountId] = useFormField<StringOrNull>(null);
  const [endowment, setEndowment] = useState(new BN(ENDOWMENT));
  const [gasLimit, setGasLimit] = useState<BN | undefined>(new BN(GAS_LIMIT));
  const [name, isNameValid, setName] = useNonEmptyString(t(defaultContractName(code.json.name)));
  const { abi, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi([code.json.abi || null, code.contractAbi || null], codeHash, true);

  const isValid = useMemo(
    (): boolean => isNameValid && !endowment.isZero() && !gasLimit?.isZero() && isAccountIdValid,
    [isAccountIdValid, endowment, gasLimit, isNameValid]
  );
  const codeOptions = useMemo(
    (): CodeOptions => allCodes.map(({ json: { codeHash, name } }): { text: string; value: string } => ({
      text: `${name} (${codeHash})`,
      value: codeHash
    })),
    [allCodes]
  );

  const constructOptions = useMemo(
    (): ConstructOptions => {
      if (!contractAbi) {
        return [];
      }

      return contractAbi.abi.contract.constructors.map(
        (constr, index) => {
          return {
            key: `${index}`,
            text: (
              <MessageSignature
                asConstructor
                message={constr}
              />
            ),
            value: `${index}`
          };
        });
    },
    [contractAbi]
  );

  const [params, setParams] = useState<any[]>(
    contractAbi && constructorIndex >= 0 ? contractAbi.abi.contract.constructors[constructorIndex].args : []
  );

  useEffect(
    (): void => {
      setParams(contractAbi ? contractAbi.abi.contract.constructors[constructorIndex].args : []);
    },
    [constructorIndex, contractAbi]
  );

  useEffect(
    (): void => {
      setName(t(defaultContractName(code.json.name)));
    },
    [code, setName, t]
  );

  const _constructCall = useCallback(
    (): any[] => {
      if (!contractAbi || constructorIndex < 0) {
        return [];
      }

      return [endowment, gasLimit, codeHash, contractAbi.constructors[constructorIndex](...params)];
    },
    [codeHash, constructorIndex, contractAbi, endowment, gasLimit, params]
  );

  const _onChangeParams = (params: any[]): void => setParams(params);

  const _onChangeGasLimit = (gasLimit?: BN): void => setGasLimit(gasLimit);

  const _onSuccess = useCallback(
    (result: SubmittableResult): void => {
      const section = api.tx.contracts ? 'contracts' : 'contract';
      const records = result.filterRecords(section, 'Instantiated');

      if (records.length) {
        // find the last EventRecord (in the case of multiple contracts deployed - we should really be
        // more clever here to find the exact contract deployed, this works for eg. Delegator)
        const address = records[records.length - 1].event.data[1] as unknown as AccountId;

        keyring.saveContract(address.toString(), {
          contract: {
            abi,
            genesisHash: api.genesisHash.toHex()
          },
          name,
          tags: []
        });

        history.push(basePath);

        onClose && onClose();
      }
    },
    [abi, api, basePath, history, name, onClose]
  );

  return (
    <Modal
      header={t('Add an existing code hash')}
      onClose={onClose}
      open={isOpen}
    >
      <Modal.Content>
        <InputAccount
          onChange={setAccountId}
          value={accountId || undefined}
        />
        <Dropdown
          defaultValue={
            codeOptions.length
              ? codeOptions[codeOptions.length - 1].value
              : undefined
          }
          help={t('The contract WASM previously deployed. Internally this is identified by the hash of the code, as either created or attached.')}
          label={t('code for this contract')}
          onChange={setCodeHash}
          options={codeOptions}
          value={codeHash}
        />
        <InputName
          isError={!isNameValid}
          onChange={setName}
          value={name || ''}
        />
        {
          isAbiSupplied
            ? null
            : (
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
            )
        }
        {
          contractAbi
            ? (
              <Dropdown
                help={t<string>('The deployment constructor information for this contract, as provided by the ABI.')}
                isDisabled={contractAbi.abi.contract.constructors.length <= 1}
                label={t('deployment constructor')}
                onChange={setConstructorIndex}
                options={constructOptions}
                value={`${constructorIndex}`}
              />
            )
            : null
        }
        <Params
          onChange={_onChangeParams}
          params={
            contractAbi && constructorIndex >= 0
              ? contractAbi.abi.contract.constructors[constructorIndex].args
              : []
          }
        />
        <InputBalance
          help={t('The allotted endowment for this contract, i.e. the amount transferred to the contract upon instantiation.')}
          isError={endowment.isZero()}
          label={t('endowment')}
          onChange={setEndowment}
          value={endowment}
        />
        <InputGas
          isError={gasLimit?.isZero()}
          onChange={_onChangeGasLimit}
          value={gasLimit}
        />

      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          icon='cloud upload'
          isDisabled={!isValid}
          isPrimary
          label={t('Deploy')}
          onClick={onClose}
          onSuccess={_onSuccess}
          params={_constructCall}
          tx={
            api.tx.contracts
              ? api.tx.contracts.instantiate
                ? 'contracts.instantiate' // V2 (new)
                : 'contracts.create' // V2 (old)
              : 'contract.create' // V1
          }
          withSpinner
        />
      </Modal.Actions>
    </Modal>
  );
}

// class Deploy2 extends ContractModal<Props, State> {
//   protected headerText = 'Deploy a new contract';

//   public isContract = true;

//   constructor (props: Props) {
//     super(props);

//     this.defaultState = {
//       ...this.defaultState,
//       constructOptions: [],
//       constructorIndex: -1,
//       endowment: new BN(ENDOWMENT),
//       gasLimit: new BN(GAS_LIMIT),
//       isHashValid: false,
//       params: [],
//       ...Deploy.getCodeState(props.codeHash)
//     };
//     this.state = this.defaultState;
//   }

//   public static getDerivedStateFromProps (props: Props, state: State): Pick<State, never> {
//     if (props.codeHash && (!state.codeHash || state.codeHash !== props.codeHash)) {
//       return Deploy.getCodeState(props.codeHash, Math.max(props.constructorIndex || 0));
//     }

//     return {};
//   }

//   private static getContractAbiState = (abi: string | null | undefined, contractAbi: Abi | null = null, constructorIndex = 0): Partial<State> => {
//     if (contractAbi) {
//       return {
//         abi,
//         constructorIndex,
//         contractAbi,
//         isAbiValid: !!contractAbi,
//         ...Deploy.getConstructorState(contractAbi, Math.max(constructorIndex, 0))
//       };
//     } else {
//       return {
//         abi: null,
//         constructOptions: [] as ConstructOptions,
//         constructorIndex: -1,
//         contractAbi: null,
//         isAbiSupplied: false,
//         isAbiValid: false,
//         ...Deploy.getConstructorState()
//       };
//     }
//   }

//   private static getCodeState = (codeHash: string | null = null, constructorIndex = 0): Pick<State, never> => {
//     if (codeHash) {
//       const code = store.getCode(codeHash);

//       if (code) {
//         const { contractAbi, json } = code;

//         return {
//           codeHash,
//           isAbiSupplied: !!contractAbi,
//           isHashValid: true,
//           isNameValid: true,
//           name: `${json.name} (instance)`,
//           ...Deploy.getContractAbiState(json.abi, contractAbi, Math.max(constructorIndex, 0))
//         };
//       }
//     }

//     return {};
//   }

//   private static getConstructorState = (contractAbi: Abi | null = null, ci = 0): Pick<State, never> => {
//     const constructorIndex = Math.max(ci, 0);

//     if (!contractAbi || constructorIndex < 0 || constructorIndex >= contractAbi.constructors.length) {
//       return {
//         constructOptions: [],
//         constructorIndex: -1,
//         params: []
//       };
//     }

//     const { abi: { contract: { constructors } } } = contractAbi;
//     const constructor = constructors[constructorIndex];
//     const constructOptions: ConstructOptions = constructors.map(
//       (constr, index) => {
//         return {
//           key: `${index}`,
//           text: (
//             <MessageSignature
//               asConstructor
//               message={constr}
//             />
//           ),
//           value: `${index}`
//         };
//       });

//     return {
//       constructOptions,
//       constructorIndex,
//       params: createValues(constructor.args)
//     };
//   }

//   protected renderContent = (): React.ReactNode => {
//     const { t } = this.props;
//     const { codeHash, constructOptions, constructorIndex, contractAbi, endowment, isAbiSupplied, isBusy, isHashValid } = this.state;

//     const codeOptions = store.getAllCode().map(({ json: { codeHash, name } }): { text: string; value: string } => ({
//       text: `${name} (${codeHash})`,
//       value: codeHash
//     }));

//     const defaultCode = codeOptions.length
//       ? codeOptions[codeOptions.length - 1].value
//       : undefined;

//     return (
//       <>
//         {this.renderInputAccount()}
//         <Dropdown
//           defaultValue={defaultCode}
//           help={t('The contract WASM previously deployed. Internally this is identified by the hash of the code, as either created or attached.')}
//           isDisabled={isBusy}
//           isError={!isHashValid}
//           label={t('code for this contract')}
//           onChange={this.onChangeCode}
//           options={codeOptions}
//           value={codeHash}
//         />
//         {this.renderInputName()}
//         {
//           isAbiSupplied
//             ? null
//             : this.renderInputAbi()
//         }
//         {
//           contractAbi
//             ? (
//               <Dropdown
//                 help={t('The deployment constructor information for this contract, as provided by the ABI.')}
//                 isDisabled={contractAbi.abi.contract.constructors.length <= 1}
//                 label={t('constructor')}
//                 onChange={this.onChangeConstructorIndex}
//                 options={constructOptions}
//                 style={{ fontFamily: 'monospace' }}
//                 value={`${constructorIndex}`}
//                 withLabel
//               />
//             )
//             : null
//         }
//         <Params
//           isDisabled={isBusy}
//           onChange={this.onChangeParams}
//           onEnter={this.sendTx}
//           params={
//             contractAbi && constructorIndex >= 0
//               ? contractAbi.abi.contract.constructors[constructorIndex].args
//               : []
//           }
//         />
//         <InputBalance
//           help={t('The allotted endowment for this contract, i.e. the amount transferred to the contract upon instantiation.')}
//           isDisabled={isBusy}
//           isError={endowment.isZero()}
//           label={t('endowment')}
//           onChange={this.onChangeEndowment}
//           onEnter={this.sendTx}
//           value={endowment}
//         />
//         {this.renderInputGas()}
//       </>
//     );
//   }

//   protected renderButtons = (): React.ReactNode => {
//     const { api, t } = this.props;
//     const { accountId, endowment, gasLimit, isAbiValid, isHashValid, isNameValid } = this.state;
//     const isEndowValid = !endowment.isZero();
//     const isGasValid = !gasLimit.isZero();
//     const isValid = isAbiValid && isHashValid && isEndowValid && isGasValid && !!accountId && isNameValid;

//     return (
//       <TxButton
//         accountId={accountId}
//         icon='cloud upload'
//         isDisabled={!isValid}
//         isPrimary
//         label={t('Deploy')}
//         onClick={this.toggleBusy(true)}
//         onFailed={this.toggleBusy(false)}
//         onSuccess={this.onSuccess}
//         params={this.constructCall}
//         tx={
//           api.tx.contracts
//             ? api.tx.contracts.instantiate
//               ? 'contracts.instantiate' // V2 (new)
//               : 'contracts.create' // V2 (old)
//             : 'contract.create' // V1
//         }
//         withSpinner
//       />
//     );
//   }

//   private constructCall = (): any[] => {
//     const { codeHash, constructorIndex, contractAbi, endowment, gasLimit, params } = this.state;

//     if (!contractAbi || constructorIndex < 0) {
//       return [];
//     }

//     return [endowment, gasLimit, codeHash, contractAbi.constructors[constructorIndex](...params)];
//   }

//   protected onAddAbi = (abi: string | null | undefined, contractAbi?: Abi | null): void => {
//     this.setState({
//       ...(Deploy.getContractAbiState(abi, contractAbi) as State)
//     });
//   }

//   private onChangeCode = (codeHash: string): void => {
//     this.setState(
//       Deploy.getCodeState(codeHash)
//     );
//   }

//   private onChangeConstructorIndex = (constructorIndexString: string): void => {
//     const { contractAbi } = this.state;
//     const constructorIndex = Math.max(0, parseInt(constructorIndexString, 10) || 0);

//     this.setState(
//       Deploy.getConstructorState(contractAbi, constructorIndex)
//     );
//   };

//   private onChangeEndowment = (endowment?: BN | null): void => {
//     this.setState({ endowment: endowment || new BN(0) });
//   }

//   private onChangeParams = (params: any[]): void => {
//     this.setState({ params });
//   }

//   private onSuccess = (result: SubmittableResult): void => {
//     const { api, history } = this.props;

//     const section = api.tx.contracts ? 'contracts' : 'contract';
//     const records = result.filterRecords(section, 'Instantiated');

//     if (records.length) {
//       // find the last EventRecord (in the case of multiple contracts deployed - we should really be
//       // more clever here to find the exact contract deployed, this works for eg. Delegator)
//       const address = records[records.length - 1].event.data[1] as unknown as AccountId;

//       this.setState(({ abi, name, tags }): Pick<State, never> | unknown => {
//         if (!abi || !name) {
//           return;
//         }

//         keyring.saveContract(address.toString(), {
//           contract: {
//             abi,
//             genesisHash: api.genesisHash.toHex()
//           },
//           name,
//           tags
//         });

//         history.push(this.props.basePath);

//         this.onClose();

//         return { isBusy: false };
//       });
//     }
//   }
// }

export default Deploy;
