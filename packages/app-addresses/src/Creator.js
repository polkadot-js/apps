// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import Input from 'semantic-ui-react/dist/es/elements/Input';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import keyring from '@polkadot/ui-keyring/src';
import addressDecode from '@polkadot/util-keyring/address/decode';
import addressEncode from '@polkadot/util-keyring/address/encode';

import Address from '@polkadot/app-accounts/src/Address';
import translate from './translate';

type Props = I18nProps & {
  onBack: () => void
};

type State = {
  address: string | null,
  publicKey: Uint8Array | null,
  fieldName: string,
  isAddressValid: boolean,
  isNameValid: boolean,
  isValid: boolean,
  name: string
}

class Creator extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.emptyState();
  }

  render (): React$Node {
    const { className, style, t } = this.props;
    const { address, fieldName, isAddressValid, isNameValid, isValid, name, publicKey } = this.state;

    return (
      <div
        className={['addresses--Creator', className].join(' ')}
        style={style}
      >
        <div className='ui--grid'>
          <div className='medium'>
            <div className='ui--row'>
              <div className='full'>
                <Label>{t('creator.address', {
                  defaultValue: 'add the following address'
                })}</Label>
                <Input
                  error={!isAddressValid}
                  name={`${fieldName}_address`}
                  onChange={this.onChangeAddress}
                  value={address}
                />
              </div>
            </div>
            <div className='ui--row'>
              <div className='full'>
                <Label>{t('creator.name', {
                  defaultValue: 'name the entry'
                })}</Label>
                <Input
                  error={!isNameValid}
                  name={`${fieldName}_name`}
                  onChange={this.onChangeName}
                  value={name}
                />
              </div>
            </div>
          </div>
          <Address
            className='medium'
            value={
              // flowlint-next-line sketchy-null-string:off
              !address || !publicKey
                ? null
                : {
                  address,
                  publicKey
                }
            }
          />
        </div>
        <div className='ui--row-buttons'>
          <Button
            onClick={this.onDiscard}
          >
            {t('creator.discard', {
              defaultValue: 'Reset'
            })}
          </Button>
          <Button
            disabled={!isValid}
            onClick={this.onCommit}
            primary
          >
            {t('creator.save', {
              defaultValue: 'Save'
            })}
          </Button>
        </div>
      </div>
    );
  }

  emptyState (): State {
    return {
      address: '',
      fieldName: `field_${Date.now()}`,
      isAddressValid: false,
      isNameValid: true,
      isValid: false,
      name: 'new address',
      publicKey: null
    };
  }

  nextState (newState: $Shape<State>): void {
    this.setState(
      (prevState: State, props: Props): $Shape<State> => {
        const { address = prevState.address, name = prevState.name } = newState;

        let nextAddress;
        let publicKey;

        try {
          // $FlowFixMe we do expect failures... sometimes
          publicKey = addressDecode(address);
          nextAddress = addressEncode(publicKey);
        } catch (error) {
          nextAddress = void 0;
          publicKey = void 0;
        }

        const isNameValid = !!name;
        const isAddressValid = !!nextAddress;

        return {
          address: nextAddress,
          isAddressValid,
          isNameValid,
          isValid: isAddressValid && isNameValid,
          name,
          publicKey
        };
      }
    );
  }

  // eslint-disable-next-line no-unused-vars
  onChangeAddress = (event: SyntheticEvent<*>, { value }): void => {
    this.nextState({ address: value });
  }

  // eslint-disable-next-line no-unused-vars
  onChangeName = (event: SyntheticEvent<*>, { value }): void => {
    this.nextState({ name: value });
  }

  onCommit = (): void => {
    const { onBack } = this.props;
    const { address, name } = this.state;

    // flowlint-next-line sketchy-null-string:off
    if (address) {
      keyring.saveAddress(address, { name });
    }

    onBack();
  }

  onDiscard = (): void => {
    this.setState(this.emptyState());
  }
}

export default translate(Creator);
