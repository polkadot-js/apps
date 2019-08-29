// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { TypeDef } from '@polkadot/types/types';
import { ApiProps } from '@polkadot/react-api/types';
import { SubmittableResult } from '@polkadot/api/SubmittableExtrinsic';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Abi } from '@polkadot/api-contract';
import { withApi, withMulti } from '@polkadot/react-api';
import keyring from '@polkadot/ui-keyring';
import { Button, Dropdown, InputBalance, TxButton } from '@polkadot/react-components';
import { getTypeDef } from '@polkadot/types';
import createValues from '@polkadot/react-params/values';

import ContractModal, { ContractModalProps, ContractModalState } from './Modal';
import Params from './Params';
import store from './store';
import translate from './translate';

type ConstructOptions = { key: string; text: string; value: string }[];

interface Props extends ContractModalProps, ApiProps, I18nProps, RouteComponentProps {
  codeHash?: string;
}

interface State extends ContractModalState {
  codeHash?: string;
  constructOptions: ConstructOptions;
  endowment: BN;
  isHashValid: boolean;
  params: any[];
}

class Deploy extends ContractModal<Props, State> {
  protected headerText = 'Deploy a new contract';

  public isContract = true;

  public constructor (props: Props) {
    super(props);

    this.defaultState = {
      ...this.defaultState,
      constructOptions: [],
      endowment: new BN(0),
      isHashValid: false,
      params: [],
      ...Deploy.getCodeState(props.codeHash)
    };
    this.state = this.defaultState;
  }

  public static getDerivedStateFromProps (props: Props, state: State): Pick<State, never> {
    if (props.codeHash && (!state.codeHash || state.codeHash !== props.codeHash)) {
      return Deploy.getCodeState(props.codeHash);
    }
    return {};
  }

  private static getContractAbiState = (abi: string | null | undefined, contractAbi: Abi | null = null): Partial<State> => {
    if (contractAbi) {
      const args = contractAbi.deploy.args.map(({ name, type }): string => `${name}: ${type}`);
      const text = `deploy(${args.join(', ')})`;

      return {
        abi,
        constructOptions: [{
          key: 'deploy',
          text,
          value: 'deploy'
        }],
        contractAbi,
        isAbiValid: !!contractAbi,
        params: createValues(
          contractAbi.deploy.args.map(({ name, type }): { type: TypeDef } => ({
            type: getTypeDef(type, name)
          }))
        )
      };
    } else {
      return {
        constructOptions: [] as ConstructOptions,
        abi: null,
        contractAbi: null,
        isAbiSupplied: false,
        isAbiValid: false,
        params: [] as unknown[]
      };
    }
  }

  private static getCodeState = (codeHash: string | null = null): Pick<State, never> => {
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
          ...Deploy.getContractAbiState(json.abi, contractAbi)
        };
      }
    }

    return {};
  }

  protected renderContent = (): React.ReactNode => {
    const { t } = this.props;
    const { codeHash, constructOptions, contractAbi, endowment, isAbiSupplied, isBusy, isHashValid } = this.state;

    const isEndowValid = !endowment.isZero();
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
                defaultValue='deploy'
                help={t('The deployment constructor information for this contract, as provided by the ABI.')}
                isDisabled
                label={t('constructor')}
                options={constructOptions}
                style={{ fontFamily: 'monospace' }}
                value='deploy'
              />
            )
            : null
        }
        <Params
          isDisabled={isBusy}
          onChange={this.onChangeParams}
          onEnter={this.sendTx}
          params={
            contractAbi
              ? contractAbi.deploy.args
              : []
          }
        />
        <InputBalance
          defaultValue={endowment}
          help={t('The allotted endownment for this contract, i.e. the amount transferred to the contract upon instantiation.')}
          isDisabled={isBusy}
          isError={!isEndowValid}
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
          isDisabled={!isValid}
          isPrimary
          label={t('Deploy')}
          onClick={this.toggleBusy(true)}
          onFailed={this.toggleBusy(false)}
          onSuccess={this.onSuccess}
          params={this.constructCall}
          tx={api.tx.contracts ? 'contracts.create' : 'contract.create'}
          ref={this.button}
        />
      </Button.Group>
    );
  }

  private constructCall = (): any[] => {
    const { codeHash, contractAbi, endowment, gasLimit, params } = this.state;

    if (!contractAbi) {
      return [];
    }

    return [endowment, gasLimit, codeHash, contractAbi.deploy(...params)];
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

  private onChangeEndowment = (endowment?: BN | null): void => {
    this.setState({ endowment: endowment || new BN(0) });
  }

  private onChangeParams = (params: any[]): void => {
    this.setState({ params });
  }

  private onSuccess = async (result: SubmittableResult): Promise<void> => {
    const { api, history } = this.props;

    const section = api.tx.contracts ? 'contracts' : 'contract';
    const record = result.findRecord(section, 'Instantiated');

    if (record) {
      const address = record.event.data[1] as unknown as AccountId;

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
