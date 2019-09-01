// Copyright 2017-2019 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import store from 'store';
import styled from 'styled-components';
import { getTypeRegistry } from '@polkadot/types';
import { Button, Editor, InputFile } from '@polkadot/react-components';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { isJsonObject, stringToU8a, u8aToString } from '@polkadot/util';

import translate from './translate';

interface Props extends AppProps, I18nProps {
  onStatusChange: (status: ActionStatus) => void;
}

interface State {
  code: string;
  isJsonValid: boolean;
  isTypesValid: boolean;
  types: Record<string, any> | {};
  typesPlaceholder?: string;
}

class Developer extends React.PureComponent<Props, State> {
  private defaultCode = '{\n\n}';

  public constructor (props: Props) {
    super(props);

    const types = store.get('types') || {};
    const names = Object.keys(types);

    this.state = {
      code: Object.keys(types).length ? JSON.stringify(types, null, 2) : this.defaultCode,
      isJsonValid: true,
      isTypesValid: true,
      types: names.length ? types : {},
      typesPlaceholder: names.length
        ? names.join(', ')
        : undefined
    };
  }

  public render (): React.ReactNode {
    const { className, t } = this.props;
    const { code, isJsonValid, isTypesValid, types, typesPlaceholder } = this.state;
    const typesHasNoEntries = Object.keys(types).length === 0;

    return (
      <div className={className}>
        <div className='ui--row'>
          <div className='full'>
            <InputFile
              clearContent={typesHasNoEntries && isTypesValid}
              help={t('Save the type definitions for your custom structures as key-value pairs in a valid JSON file. The key should be the name of your custom structure and the value an object containing your type definitions.')}
              isError={!isTypesValid}
              label={t('Additional types as a JSON file (or edit below)')}
              onChange={this.onChangeTypes}
              placeholder={typesPlaceholder}
            />
          </div>
        </div>
        <div className='ui--row'>
          <div className='full'>
            <Editor
              className='editor'
              code={code}
              isValid={isJsonValid}
              onEdit={this.onEditTypes}
            />
          </div>
        </div>
        <Button.Group>
          <Button
            isDisabled={typesHasNoEntries}
            isNegative
            onClick={this.clearTypes}
            label={t('Reset')}
          />
          <Button.Or />
          <Button
            isDisabled={!isTypesValid || !isJsonValid || typesHasNoEntries}
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
      types: {},
      typesPlaceholder: undefined
    });
  }

  private onChangeTypes = (data: Uint8Array): void => {
    const code = u8aToString(data);

    try {
      const types = JSON.parse(code);
      const typesPlaceholder = Object.keys(types).join(', ');

      console.log('Detected types:', typesPlaceholder);

      this.setState({
        code,
        isJsonValid: true,
        isTypesValid: true,
        types: Object.keys(types).length === 0 ? {} : types,
        typesPlaceholder
      });
    } catch (error) {
      console.error('Error registering types:', error);

      this.setState({
        code,
        isJsonValid: false,
        isTypesValid: false,
        types: {},
        typesPlaceholder: error.message
      });
    }
  }

  private onEditTypes = (code: string): void => {
    try {
      if (!isJsonObject(code)) {
        throw Error(this.props.t('This is not a valid JSON object.'));
      }

      this.setState((prevState: State): Pick<State, never> => ({
        ...prevState,
        code,
        isJsonValid: true
      }));

      this.onChangeTypes(stringToU8a(code));
    } catch (e) {
      this.setState((prevState: State): Pick<State, never> => ({
        ...prevState,
        code,
        isJsonValid: false,
        typesPlaceholder: e.message
      }));
    }
  }

  private saveDeveloper = (): void => {
    const { t } = this.props;
    const { types } = this.state;

    try {
      getTypeRegistry().register(types);

      store.set('types', types);

      this.setState({ isTypesValid: true });
      this.props.onStatusChange({
        status: 'success',
        action: t('Your custom types have been added')
      });
    } catch (e) {
      console.error(e);
      this.setState({ isTypesValid: false });
      this.props.onStatusChange({
        status: 'error',
        action: t(`Error saving your custom types. ${e}`)
      });
    }
  }
}

export default translate(styled(Developer)`
  .editor {
    height: 21rem;
    margin-left: 2rem;
    position: relative;
  }
`);
