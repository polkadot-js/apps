// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringPair } from '@polkadot/util-keyring/types';
import type { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';

import Input from '@polkadot/ui-app/src/Input';
import InputAddress from '@polkadot/ui-app/src/InputAddress';
import keyring from '@polkadot/ui-keyring/src';

import Address from './Address';
import translate from './translate';

type Props = I18nProps & {
  onBack: () => void
};

type State = {
  currentPair: KeyringPair | null,
  defaultPublicKey?: Uint8Array,
  editedName: string,
  isEdited: boolean
}

class Editor extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const pairs = keyring.getPairs();
    const currentPair = pairs[pairs.length - 1] || null;

    this.state = this.createState(currentPair);
    this.state.defaultPublicKey = currentPair
      ? currentPair.publicKey()
      : void 0;
  }

  render (): React$Node {
    const { className, style, t } = this.props;
    const { defaultPublicKey, currentPair, editedName, isEdited } = this.state;

    if (!currentPair) {
      return (
        <div
          className={['accounts--Editor', className].join(' ')}
          style={style}
        >
          {t('editor.none', {
            defaultValue: 'There are no saved accounts. Add some first.'
          })}
        </div>
      );
    }

    const address = currentPair.address();

    return (
      <div
        className={['accounts--Editor', className].join(' ')}
        style={style}
      >
        <div className='ui--grid'>
          <Address
            className='shrink'
            value={address}
          />
          <div className='grow'>
            <div className='ui--row'>
              <InputAddress
                className='full'
                defaultValue={defaultPublicKey}
                hideAddress
                isSUIInput={false}
                label={t('editor.select', {
                  defaultValue: 'using my account'
                })}
                onChange={this.onChangeAccount}
                type='account'
                value={address}
              />
            </div>
            <div className='ui--row'>
              <Input
                className='full'
                label={t('editor.name', {
                  defaultValue: 'identified by the name'
                })}
                onChange={this.onChangeName}
                value={editedName}
              />
            </div>
          </div>
        </div>
        <div className='ui--row-buttons'>
          <Button
            disabled={!isEdited}
            onClick={this.onDiscard}
          >
            {t('editor.reset', {
              defaultValue: 'Reset'
            })}
          </Button>
          <Button
            disabled={!isEdited}
            onClick={this.onCommit}
            primary
          >
            {t('editor.save', {
              defaultValue: 'Save'
            })}
          </Button>
          <Button
            negative
            onClick={this.onForget}
            primary
          >
            {t('editor.forget', {
              defaultValue: 'Forget'
            })}
          </Button>
        </div>
      </div>
    );
  }

  createState (currentPair: KeyringPair | null): $Shape<State> {
    return {
      currentPair,
      editedName: currentPair
        ? currentPair.getMeta().name || ''
        : '',
      isEdited: false
    };
  }

  nextState (newState?: $Shape<State> = {}): void {
    this.setState(
      (prevState: State): $Shape<State> => {
        let { currentPair = prevState.currentPair, editedName = prevState.editedName } = newState;
        const previous = prevState.currentPair || { address: () => null };
        let isEdited = false;

        if (currentPair) {
          if (currentPair.address() !== previous.address()) {
            editedName = currentPair.getMeta().name || '';
          } else if (editedName !== currentPair.getMeta().name) {
            isEdited = true;
          }
        } else {
          editedName = '';
        }

        return {
          currentPair,
          editedName,
          isEdited
        };
      }
    );
  }

  onChangeAccount = (publicKey: Uint8Array): void => {
    const currentPair = keyring.getPair(publicKey);

    this.nextState({
      currentPair
    });
  }

  onChangeName = (editedName: string): void => {
    this.nextState({ editedName });
  }

  onCommit = (): void => {
    const { currentPair, editedName } = this.state;

    if (!currentPair) {
      return;
    }

    keyring.saveAccountMeta(currentPair, {
      name: editedName,
      whenEdited: Date.now()
    });

    this.nextState({});
  }

  onDiscard = (): void => {
    const { currentPair } = this.state;

    if (!currentPair) {
      return;
    }

    this.nextState({
      editedName: currentPair.getMeta().name
    });
  }

  onForget = (): void => {
    const { currentPair } = this.state;

    if (!currentPair) {
      return;
    }

    const address = currentPair.address();
    const pairs = keyring.getPairs().filter((item) =>
      item.address() !== address
    );
    const nextPair = pairs[pairs.length - 1] || null;
    const defaultPublicKey = nextPair
      ? nextPair.publicKey()
      : void 0;

    keyring.forgetAccount(address);

    this.nextState({
      currentPair: nextPair,
      defaultPublicKey
    });
  }
}

export default translate(Editor);
