// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { SubmittableResult } from '@polkadot/api';
import { Abi } from '@polkadot/api-contract';
import { withApi, withMulti } from '@polkadot/react-api';
import keyring from '@polkadot/ui-keyring';
import { Button, Dropdown, InputBalance, MessageSignature, TxButton } from '@polkadot/react-components';
import createValues from '@polkadot/react-params/values';

import ContractModal, { ContractModalProps, ContractModalState } from './Modal';
import Params from './Params';
import store from './store';
import translate from './translate';
import { GAS_LIMIT } from './constants';

type ConstructOptions = { key: string; text: React.ReactNode; value: string }[];

interface Props extends ContractModalProps, ApiProps, I18nProps, RouteComponentProps {
  codeHash?: string;
  constructorIndex?: number;
}

interface State extends ContractModalState {
  codeHash?: string;
  constructorIndex: number;
  constructOptions: ConstructOptions;
  endowment: BN;
  isHashValid: boolean;
  params: any[];
}

class Deploy extends ContractModal<Props, State> {
  protected headerText = 'Deploy a new contract';

  public isContract = true;

  constructor (props: Props) {
    super(props);

    this.defaultState = {
      ...this.defaultState,
      constructorIndex: -1,
      constructOptions: [],
      endowment: new BN(0),
      gasLimit: new BN(GAS_LIMIT),
      isHashValid: false,
      params: [],
      ...Deploy.getCodeState(props.codeHash)
    };
    this.state = this.defaultState;
  }

  public static getDerivedStateFromProps (props: Props, state: State): Pick<State, never> {
    if (props.codeHash && (!state.codeHash || state.codeHash !== props.codeHash)) {
      return Deploy.getCodeState(props.codeHash, Math.max(props.constructorIndex || 0));
    }

    return {};
  }

  private static getContractAbiState = (abi: string | null | undefined, contractAbi: Abi | null = null, constructorIndex = 0): Partial<State> => {
    if (contractAbi) {
      return {
        abi,
        constructorIndex,
        contractAbi,
        isAbiValid: !!contractAbi,
        ...Deploy.getConstructorState(contractAbi, Math.max(constructorIndex, 0))
      };
    } else {
      return {
        constructorIndex: -1,
        constructOptions: [] as ConstructOptions,
        abi: null,
        contractAbi: null,
        isAbiSupplied: false,
        isAbiValid: false,
        ...Deploy.getConstructorState()
      };
    }
  }

  private static getCodeState = (codeHash: string | null = null, constructorIndex = 0): Pick<State, never> => {
    if (codeHash) {
      const code = store.getCode(codeHash);

      if (code) {
        const { contractAbi, json } = code;

        return {
          codeHash,
          isAbiSupplied: !!contractAbi,
          name: `${json.name} (instance)`,
          isHashValid: true,
          isNameValid: true,
          ...Deploy.getContractAbiState(json.abi, contractAbi, Math.max(constructorIndex, 0))
        };
      }
    }

    return {};
  }

  private static getConstructorState = (contractAbi: Abi | null = null, ci = 0): Pick<State, never> => {
    const constructorIndex = Math.max(ci, 0);
    if (!contractAbi || constructorIndex < 0 || constructorIndex >= contractAbi.constructors.length) {
      return {
        constructorIndex: -1,
        constructOptions: [],
        params: []
      };
    }

    const { abi: { contract: { constructors } } } = contractAbi;
    const constructor = constructors[constructorIndex];
    const constructOptions: ConstructOptions = constructors.map(
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

    return {
      constructorIndex,
      constructOptions,
      params: createValues(constructor.args)
    };
  }

  protected renderContent = (): React.ReactNode => {
    const { t } = this.props;
    const { codeHash, constructorIndex, constructOptions, contractAbi, endowment, isAbiSupplied, isBusy, isHashValid } = this.state;

    const codeOptions = store.getAllCode().map(({ json: { codeHash, name } }): { text: string; value: string } => ({
      text: `${name} (${codeHash})`,
      value: codeHash
    }));

    const defaultCode = codeOptions.length
      ? codeOptions[codeOptions.length - 1].value
      : undefined;

    return (
      <>
        {this.renderInputAccount()}
        <Dropdown
          defaultValue={defaultCode}
          help={t('The contract WASM previously deployed. Internally this is identified by the hash of the code, as either created or attached.')}
          isDisabled={isBusy}
          isError={!isHashValid}
          label={t('code for this contract')}
          onChange={this.onChangeCode}
          options={codeOptions}
          value={codeHash}
        />
        {this.renderInputName()}
        {
          isAbiSupplied
            ? null
            : this.renderInputAbi()
        }
        {
          contractAbi
            ? (
              <Dropdown
                help={t('The deployment constructor information for this contract, as provided by the ABI.')}
                isDisabled={contractAbi.abi.contract.constructors.length <= 1}
                label={t('constructor ')}
                onChange={this.onChangeConstructorIndex}
                options={constructOptions}
                style={{ fontFamily: 'monospace' }}
                value={`${constructorIndex}`}
                withLabel
              />
            )
            : null
        }
        <Params
          isDisabled={isBusy}
          onChange={this.onChangeParams}
          onEnter={this.sendTx}
          params={
            contractAbi && constructorIndex >= 0
              ? contractAbi.abi.contract.constructors[constructorIndex].args
              : []
          }
        />
        <InputBalance
          help={t('The allotted endowment for this contract, i.e. the amount transferred to the contract upon instantiation.')}
          isDisabled={isBusy}
          isError={endowment.isZero()}
          label={t('endowment')}
          onChange={this.onChangeEndowment}
          onEnter={this.sendTx}
          value={endowment}
        />
        {this.renderInputGas()}
      </>
    );
  }

  protected renderButtons = (): React.ReactNode => {
    const { api, t } = this.props;
    const { accountId, endowment, gasLimit, isAbiValid, isHashValid, isNameValid } = this.state;
    const isEndowValid = !endowment.isZero();
    const isGasValid = !gasLimit.isZero();
    const isValid = isAbiValid && isHashValid && isEndowValid && isGasValid && !!accountId && isNameValid;

    return (
      <Button.Group>
        {this.renderCancelButton()}
        <TxButton
          accountId={accountId}
          icon='cloud upload'
          isDisabled={!isValid}
          isPrimary
          label={t('Deploy')}
          onClick={this.toggleBusy(true)}
          onFailed={this.toggleBusy(false)}
          onSuccess={this.onSuccess}
          params={this.constructCall}
          tx={
            api.tx.contracts
              ? api.tx.contracts.instantiate
                ? 'contracts.instantiate' // V2 (new)
                : 'contracts.create' // V2 (old)
              : 'contract.create' // V1
          }
          ref={this.button}
        />
      </Button.Group>
    );
  }

  private constructCall = (): any[] => {
    const { codeHash, constructorIndex, contractAbi, endowment, gasLimit, params } = this.state;

    if (!contractAbi || constructorIndex < 0) {
      return [];
    }

    return [endowment, gasLimit, codeHash, contractAbi.constructors[constructorIndex](...params)];
  }

  protected onAddAbi = (abi: string | null | undefined, contractAbi?: Abi | null): void => {
    this.setState({
      ...(Deploy.getContractAbiState(abi, contractAbi) as State)
    });
  }

  private onChangeCode = (codeHash: string): void => {
    this.setState(
      Deploy.getCodeState(codeHash)
    );
  }

  private onChangeConstructorIndex = (constructorIndexString: string): void => {
    const { contractAbi } = this.state;
    const constructorIndex = Math.max(0, parseInt(constructorIndexString, 10) || 0);

    this.setState(
      Deploy.getConstructorState(contractAbi, constructorIndex)
    );
  };

  private onChangeEndowment = (endowment?: BN | null): void => {
    this.setState({ endowment: endowment || new BN(0) });
  }

  private onChangeParams = (params: any[]): void => {
    this.setState({ params });
  }

  private onSuccess = (result: SubmittableResult): void => {
    const { api, history } = this.props;

    const section = api.tx.contracts ? 'contracts' : 'contract';
    const records = result.filterRecords(section, 'Instantiated');

    if (records.length) {
      // find the last EventRecord (in the case of multiple contracts deployed - we should really be
      // more clever here to find the exact contract deployed, this works for eg. Delegator)
      const address = records[records.length - 1].event.data[1] as unknown as AccountId;

      this.setState(({ abi, name, tags }): Pick<State, never> | unknown => {
        if (!abi || !name) {
          return;
        }

        keyring.saveContract(address.toString(), {
          name,
          contract: {
            abi,
            genesisHash: api.genesisHash.toHex()
          },
          tags
        });

        history.push(this.props.basePath);

        this.onClose();

        return { isBusy: false };
      });
    }
  }
}

export default withMulti(
  withRouter(Deploy),
  translate,
  withApi
);
