// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringPair } from '@polkadot/util-keyring/types';
import type { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import Input from '@polkadot/ui-app/src/Input';
import keyring from '@polkadot/ui-keyring/src';
import InputAddress from '@polkadot/ui-app/src/InputAddress';

import Address from './Address';
import translate from './translate';

type Props = I18nProps & {
  onBack: () => void
};

type State = {
  currentPair: KeyringPair,
  defaultPublicKey: Uint8Array,
  editedName: string,
  isEdited: boolean
}

class Editor extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const pairs = keyring.getPairs();
    const currentPair = pairs[pairs.length - 1];

    this.state = this.createState(currentPair);
    this.state.defaultPublicKey = currentPair.publicKey();
  }

  render (): React$Node {
    const { className, style, t } = this.props;
    const { defaultPublicKey, currentPair, editedName, isEdited } = this.state;

    return (
      <div
        className={['accounts--Editor', className].join(' ')}
        style={style}
      >
        <div className='ui--grid'>
          <div className='medium'>
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
          <Address
            className='medium'
            value={{
              address: currentPair.address(),
              publicKey: currentPair.publicKey()
            }}
          />
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
        </div>
      </div>
    );
  }

  createState (currentPair: KeyringPair): $Shape<State> {
    const { name = '' } = currentPair.getMeta();

    return {
      currentPair,
      editedName: name,
      isEdited: false
    };
  }

  nextState (newState?: $Shape<State> = {}): void {
    this.setState(
      (prevState: State): $Shape<State> => {
        let { currentPair = prevState.currentPair, editedName = prevState.editedName } = newState;

        if (currentPair.address() !== prevState.currentPair.address()) {
          editedName = currentPair.getMeta().name || '';
        }

        const isEdited = editedName !== currentPair.getMeta().name;

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

    keyring.saveAccountMeta(currentPair, {
      name: editedName,
      whenEdited: Date.now()
    });

    this.nextState({});
  }

  onDiscard = (): void => {
    const { currentPair } = this.state;

    this.nextState({
      editedName: currentPair.getMeta().name
    });
  }
}

export default translate(Editor);
