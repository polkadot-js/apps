// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { SubmittableResult } from '@polkadot/api/SubmittableExtrinsic';
import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Abi } from '@polkadot/api-contract';
import { withApi, withMulti } from '@polkadot/ui-api';
import keyring from '@polkadot/ui-keyring';
import { Button, Dropdown, InputBalance, TxButton } from '@polkadot/ui-app';
import { AccountId, getTypeDef } from '@polkadot/types';
import createValues from '@polkadot/ui-params/values';

import ContractModal, { ContractModalProps, ContractModalState } from './Modal';
import Params from './Params';
import store from './store';
import translate from './translate';

type ConstructOptions = Array<{key: string, text: string, value: string}>;

type Props = ContractModalProps & ApiProps & I18nProps & RouteComponentProps & {
  codeHash?: string
};

type State = ContractModalState & {
  codeHash?: string,
  constructOptions: ConstructOptions,
  endowment: BN,
  isHashValid: boolean,
  params: Array<any>
};

class Deploy extends ContractModal<Props, State> {
  headerText = 'Deploy a new contract';
  isContract = true;

  constructor (props: Props) {
    super(props);

    this.defaultState = {
      ...this.defaultState,
      constructOptions: [],
      endowment: new BN(0),
      isHashValid: false,
      params: [],
      ...this.getCodeState(props.codeHash)
    };
    this.state = this.defaultState;
  }

  componentWillReceiveProps (nextProps: Props, nextState: State) {
    super.componentWillReceiveProps(nextProps, nextState);

    if (nextProps.codeHash && nextProps.codeHash !== this.props.codeHash) {
      this.setState(
        this.getCodeState(nextProps.codeHash)
      );
    }
  }

  renderContent = () => {
    const { t } = this.props;
    const { codeHash, constructOptions, contractAbi, endowment, isAbiSupplied, isBusy, isHashValid } = this.state;

    const isEndowValid = !endowment.isZero();
    const codeOptions = store.getAllCode().map(({ json: { codeHash, name } }) => ({
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

  renderButtons = () => {
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

  private getContractAbiState = (abi: string | null | undefined, contractAbi: Abi | null = null): State => {
    if (contractAbi) {
      const args = contractAbi.deploy.args.map(({ name, type }) => name + ': ' + type);
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
          contractAbi.deploy.args.map(({ name, type }) => ({
            type: getTypeDef(type, name)
          }))
        )
      } as State;
    } else {
      return {
        constructOptions: [] as ConstructOptions,
        abi: null,
        contractAbi: null,
        isAbiSupplied: false,
        isAbiValid: false,
        params: [] as Array<any>
      } as State;
    }
  }

  private getCodeState = (codeHash: string | null = null): State => {
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
          ...this.getContractAbiState(json.abi, contractAbi)
        } as State;
      }
    }

    return {} as State;
  }

  private constructCall = (): Array<any> => {
    const { codeHash, contractAbi, endowment, gasLimit, params } = this.state;

    if (!contractAbi) {
      return [];
    }

    return [endowment, gasLimit, codeHash, contractAbi.deploy(...params)];
  }

  protected onAddAbi = (abi: string | null | undefined, contractAbi?: Abi | null): void => {
    this.setState({
      ...this.getContractAbiState(abi, contractAbi)
    });
  }

  private onChangeCode = (codeHash: string): void => {
    this.setState(
      this.getCodeState(codeHash)
    );
  }

  private onChangeEndowment = (endowment?: BN | null): void => {
    this.setState({ endowment: endowment || new BN(0) });
  }

  private onChangeParams = (params: Array<any>): void => {
    this.setState({ params });
  }

  private onSuccess = async (result: SubmittableResult) => {
    const { api, history } = this.props;

    const section = api.tx.contracts ? 'contracts' : 'contract';
    const record = result.findRecord(section, 'Instantiated');

    if (record) {
      const address = record.event.data[1] as any as AccountId;

      this.setState(({ abi, name, tags }) => {
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

        return { isBusy: false } as State;
      });
    }

  }
}

export default withMulti(
  Deploy,
  translate,
  withRouter,
  withApi
);
