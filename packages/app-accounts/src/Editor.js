// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringPair } from '@polkadot/util-keyring/types';
import type { KeyringOptions } from '@polkadot/ui-react-app/InputAddress/types';
import type { I18nProps, KeyringInstance } from '@polkadot/ui-react-app/types';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import Input from 'semantic-ui-react/dist/es/elements/Input';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import InputAddress from '@polkadot/ui-react-app/src/InputAddress';
import createOptions from '@polkadot/ui-react-app/src/InputAddress/options';

import translate from './translate';

type Props = I18nProps & {
  keyring: KeyringInstance,
  onBack: () => void
};

type State = {
  currentPair: KeyringPair,
  defaultPublicKey: Uint8Array,
  editedName: string,
  isEdited: boolean,
  options: KeyringOptions
}

class Editor extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    const pairs = props.keyring.getPairs();
    const currentPair = pairs[pairs.length - 1];

    this.state = this.createState(currentPair);
    this.state.defaultPublicKey = currentPair.publicKey();
    this.state.options = this.createOptions();
  }

  render (): React$Node {
    const { className, style, t } = this.props;
    const { defaultPublicKey, editedName, isEdited, options } = this.state;

    return (
      <div
        className={['accounts--Editor', className].join(' ')}
        style={style}
      >
        <div className='ui--form'>
          <InputAddress
            defaultValue={defaultPublicKey}
            options={options}
            label={t('editor.select', {
              defaultValue: 'using my account'
            })}
            onChange={this.onChangeAccount}
          />
        </div>
        <div className='ui--form'>
          <div className='medium'>
            <Label>{t('editor.name', {
              defaultValue: 'identified by the name'
            })}</Label>
            <Input
              onChange={this.onChangeName}
              value={editedName}
            />
          </div>
        </div>
        <div className='ui--form-buttons'>
          <Button
            disabled={!isEdited}
            negative
            onClick={this.onDiscard}
            primary
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

  createOptions (): KeyringOptions {
    return createOptions(this.props.keyring);
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
        let { currentPair = prevState.currentPair, editedName = prevState.editedName, options = prevState.options } = newState;

        if (currentPair.address() !== prevState.currentPair.address()) {
          editedName = currentPair.getMeta().name || '';
        }

        const isEdited = editedName !== currentPair.getMeta().name;

        return {
          currentPair,
          editedName,
          isEdited,
          options
        };
      }
    );
  }

  onChangeAccount = (publicKey: Uint8Array): void => {
    const { keyring } = this.props;
    const currentPair = keyring.getPair(publicKey);

    this.nextState({ currentPair });
  }

  // eslint-disable-next-line no-unused-vars
  onChangeName = (event: SyntheticEvent<*>, { value }): void => {
    this.nextState({ editedName: value });
  }

  onCommit = (): void => {
    const { currentPair, editedName } = this.state;

    currentPair.setMeta({ name: editedName });

    this.nextState({ options: this.createOptions() });
  }

  onDiscard = (): void => {
    const { currentPair } = this.state;

    this.nextState({ editedName: currentPair.getMeta().name });
  }
}

export default translate(Editor);
