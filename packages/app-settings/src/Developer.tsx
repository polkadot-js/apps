// Copyright 2017-2019 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import store from 'store';
import { getTypeRegistry } from '@polkadot/types';
import { Button, Editor, InputFile } from '@polkadot/ui-app/index';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { stringToU8a, u8aToString } from '@polkadot/util';

import translate from './translate';

type Props = AppProps & I18nProps & {
  onStatusChange: (status: ActionStatus) => void
};

type State = {
  code: string,
  isJsonValid: boolean,
  isTypesValid: boolean,
  types?: { [index: string]: any } | null,
  typesPlaceholder?: string
};

class Developer extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    const types = store.get('types') || {};
    const names = Object.keys(types);

    this.state = {
      code: '',
      isJsonValid: true,
      isTypesValid: true,
      types: names.length ? types : null,
      typesPlaceholder: names.length
        ? names.join(', ')
        : undefined
    };
  }

  render () {
    const { t } = this.props;
    const { isJsonValid, isTypesValid, types, typesPlaceholder } = this.state;
    const code = types ? JSON.stringify(types, null, 2) : '{\n\t\n}' ;

    return (
      <div className='settings-Developer'>
        <div className='ui--row'>
          <div className='full'>
            <InputFile
              clearContent={!types && isTypesValid}
              isError={!isTypesValid}
              label={t('Upload your additional type definitions as a JSON file')}
              onChange={this.onChangeTypes}
              placeholder={typesPlaceholder}
            />
          </div>
        </div>
        <div className='ui--row'>
          <div className='full'>
            <div className='ui--Labelled'>
              <label>{t('Manually enter your custom type definitions as valid JSON')}</label>
              <div className='ui--Labelled-content'>
                <Editor
                  className='editor'
                  code={code}
                  isValid={isJsonValid}
                  onEdit={this.onEditTypes}
                />
              </div>
            </div>
          </div>
        </div>
        <Button.Group>
          <Button
            isDisabled={!types}
            isNegative
            onClick={this.clearTypes}
            label={t('Reset')}
          />
          <Button.Or />
          <Button
            isDisabled={!isTypesValid}
            isPrimary
            onClick={this.saveDeveloper}
            label={t('Save')}
          />
        </Button.Group>
      </div>
    );
  }

  private clearTypes = (): void => {
    store.remove('types');
    this.setState({
      isTypesValid: true,
      types: null,
      typesPlaceholder: ''
    });
  }

  private onChangeTypes = (data: Uint8Array) => {
    console.log('Im changing', data);
    try {
      // console.log('first here?');
      // const u8t = u8aToString(data);
      // console.log('here?');
      const types = JSON.parse(u8aToString(data));
      const typesPlaceholder = Object.keys(types).join(', ');

      console.log('Registering types:', typesPlaceholder);

      getTypeRegistry().register(types);

      this.setState({
        isTypesValid: true,
        types,
        typesPlaceholder
      });
    } catch (error) {
      console.error('Registering types:', error);

      this.setState({
        isTypesValid: false,
        types: null,
        typesPlaceholder: error.message
      });
    }
  }

  private onEditTypes = (code: string): void => {
    try {
      const nextTypes = JSON.parse(code);
      this.setState({ isJsonValid: true });

      console.log(nextTypes, this.state.types);
      if (nextTypes !== this.state.types) {
        console.log('changed',stringToU8a(code));
        const data = stringToU8a(code);
        this.onChangeTypes(data);
      }
    } catch (e) {
      this.setState({
        isJsonValid: false,
        isTypesValid: false,
        code: code
      });

      console.log('ERROR', e);
    }

    // this.onChangeTypes(data);
    // if (JSON.parse(code) !== this.state.types) {
    //   const data = stringToU8a(code);
    //   this.onChangeTypes(data);
    // }
  }

  private saveDeveloper = (): void => {
    const { t } = this.props;
    const { isTypesValid, types } = this.state;

    const status = {
      status: 'success',
      action: t('Your custom types have been added')
    } as ActionStatus;

    if (isTypesValid) {
      store.set('types', types);
    } else {
      status.status = 'error';
      status.action = t('Your custom types are invalid');
    }

    this.props.onStatusChange(status);
  }
}

export default translate(Developer);
