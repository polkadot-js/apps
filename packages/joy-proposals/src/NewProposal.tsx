import BN from 'bn.js';
import React from 'react';

import { u8aToHex } from '@polkadot/util';
import { withCalls } from '@polkadot/ui-api/with';
import { Input, InputFile, Labelled } from '@polkadot/ui-app/index';
import { formatNumber } from '@polkadot/ui-app/util';
import { Balance } from '@polkadot/types';

import translate from './translate';
import { nonEmptyStr } from '@polkadot/joy-utils';
import AccountSelector from '@polkadot/joy-utils/AccountSelector';
import TxButton from '@polkadot/joy-utils/TxButton';
import InputStake from '@polkadot/joy-utils/InputStake';
import TextArea from '@polkadot/joy-utils/TextArea';

type Props = {
  minStake?: Balance
};

type State = {
  accountId?: string,
  stake?: BN,
  name?: string,
  description?: string,
  wasmCode?: Uint8Array,
  isStakeValid?: boolean,
  isNameValid?: boolean,
  isDescriptionValid?: boolean,
  isWasmCodeValid?: boolean
};

class Component extends React.PureComponent<Props, State> {

  state: State = {};

  render () {
    const { accountId, stake, name, description, wasmCode, isStakeValid, isWasmCodeValid } = this.state;
    const isFormValid = this.isFormValid();

    const wasmFilePlaceholder = wasmCode && isWasmCodeValid
      ? formatNumber(wasmCode.length) + ' bytes'
      : 'Drag and drop a WASM file here';

    const wasmHex = isFormValid ? u8aToHex(wasmCode) : null;

    return (
      <div>
        <AccountSelector onChange={this.onChangeAccount} />
        <InputStake
          min={this.minStake()}
          isValid={isStakeValid}
          onChange={this.onChangeStake}
        />
        <div className='ui--row'>
          <Input
            label='Proposal name:'
            value={name}
            onChange={this.onChangeName}
          />
        </div>
        <div className='ui--row'>
          <TextArea
            rows={3}
            autoHeight={true}
            label='Full description:'
            placeholder='Provide full description of your proposal: new features, improvements, bug fixes etc.'
            onChange={this.onChangeDescription}
            value={description}
          />
        </div>
        <div className='ui--row'>
          <div className='full'>
            <InputFile
              // clearContent={!wasmCode && isWasmCodeValid}
              // isError={!isWasmCodeValid}
              label='WASM code of runtime upgrade:'
              placeholder={wasmFilePlaceholder}
              onChange={this.onChangeWasmCode}
            />
          </div>
        </div>
        <Labelled style={{ marginTop: '.5rem' }}>
          <TxButton
            isDisabled={!isFormValid}
            accountId={accountId}
            label='Submit my proposal'
            params={[stake, name, description, wasmHex]}
            tx='proposals.createProposal'
          />
        </Labelled>
      </div>
    );
  }

  private onChangeAccount = (accountId?: string) => {
    this.setState({ accountId });
  }

  private onChangeName = (name?: string) => {
    // TODO validate min / max len based on properties from Substrate:
    const isNameValid = nonEmptyStr(name);
    this.setState({ name, isNameValid });
  }

  private onChangeDescription = (description?: string) => {
    // TODO validate min / max len based on properties from Substrate:
    const isDescriptionValid = nonEmptyStr(description);
    this.setState({ description, isDescriptionValid });
  }

  private onChangeWasmCode = (wasmCode: Uint8Array) => {
    // TODO validate min / max len based on properties from Substrate:
    let isWasmCodeValid = wasmCode && wasmCode.length > 0;
    this.setState({ wasmCode, isWasmCodeValid });
  }

  private minStake = (): BN => {
    return this.props.minStake || new BN(1);
  }

  private onChangeStake = (stake?: BN): void => {
    const isStakeValid = stake && stake.gte(this.minStake());
    this.setState({ stake, isStakeValid });
  }

  private isFormValid = (): boolean => {
    const s = this.state;
    return s.isStakeValid && s.isNameValid && s.isDescriptionValid && s.isWasmCodeValid;
  }
}

// inject the actual API calls automatically into props
export default translate(
  withCalls<Props>(
    ['query.proposals.minimumStake', { propName: 'minStake' }]
  )(Component)
);
