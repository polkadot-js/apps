// Copyright 2017-2019 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import store from 'store';
import { getTypeRegistry } from '@polkadot/types';
import { Button, Editor, InputFile } from '@polkadot/ui-app';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { isJsonObject, stringToU8a, u8aToString } from '@polkadot/util';

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
  private defaultCode: string = `{\n\n}`;

  constructor (props: Props) {
    super(props);

    const types = store.get('types') || {};
    const names = Object.keys(types);

    this.state = {
      code: Object.keys(types).length ? JSON.stringify(types, null, 2) : this.defaultCode,
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
    const { code, isJsonValid, isTypesValid, types, typesPlaceholder } = this.state;

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
            isDisabled={!isTypesValid || !isJsonValid}
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
      code: this.defaultCode,
      isJsonValid: true,
      isTypesValid: true,
      types: null,
      typesPlaceholder: undefined
    });
  }

  private onChangeTypes = (data: Uint8Array) => {

    const dataToString = u8aToString(data);

    try {
      const types = JSON.parse(dataToString);
      const typesPlaceholder = Object.keys(types).join(', ');

      console.log('Registering types:', typesPlaceholder);

      getTypeRegistry().register(types);

      this.setState({
        code: dataToString,
        isJsonValid: true,
        isTypesValid: true,
        types,
        typesPlaceholder
      });

    } catch (error) {

      console.error('Error registering types:', error);

      this.setState({
        code: dataToString,
        isJsonValid: false,
        isTypesValid: false,
        types: null,
        typesPlaceholder: error.message
      });
    }
  }

  private onEditTypes = (code: string): void => {
    try {
      if (!isJsonObject(code)) {
        throw Error(this.props.t('This is not a valid JSON object.'));
      }

      this.setState((prevState: State) => ({
        ...prevState,
        code,
        isJsonValid: true
      }) as State);

      this.onChangeTypes(stringToU8a(code));
    } catch (e) {
      this.setState((prevState: State) => ({
        ...prevState,
        code,
        isJsonValid: false,
        typesPlaceholder: e.message
      }) as State);
    }
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
