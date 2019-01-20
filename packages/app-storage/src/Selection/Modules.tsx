// Copyright 2017-2019 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef, getTypeDef } from '@polkadot/types/codec';
import { StorageFunction } from '@polkadot/types/StorageKey';
import { I18nProps } from '@polkadot/ui-app/types';
import { RawParams } from '@polkadot/ui-params/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { PartialModuleQuery } from '../types';

import React from 'react';
import { Button, InputStorage, Labelled } from '@polkadot/ui-app/index';
import Params from '@polkadot/ui-params/index';
import { withApi, withMulti } from '@polkadot/ui-api/index';
import { isUndefined } from '@polkadot/util';

import translate from '../translate';

type Props = ApiProps & I18nProps & {
  onAdd: (query: PartialModuleQuery) => void
};

type State = {
  isValid: boolean,
  key: StorageFunction,
  values: RawParams,
  params: Array<{ type: TypeDef }>
};

class Modules extends React.PureComponent<Props, State> {
  private defaultValue: any;
  state: State;

  constructor (props: Props) {
    super(props);

    const { api } = this.props;

    this.defaultValue = api.query.timestamp.now;
    this.state = {
      isValid: true,
      key: this.defaultValue,
      values: [],
      params: []
    };
  }

  render () {
    const { t } = this.props;
    const { isValid, key, params } = this.state;

    return (
      <section className='storage--actionrow'>
        <div className='storage--actionrow-value'>
          <InputStorage
            defaultValue={this.defaultValue}
            labelSection={t('query state section')}
            onChange={this.onChangeKey}
          />
          <Params
            key={`${key.section}.${key.method}`}
            onChange={this.onChangeParams}
            params={params}
          />
        </div>
        <Labelled className='storage--actionrow-buttons'>
          <Button
            icon='plus'
            isDisabled={!isValid}
            isPrimary
            onClick={this.onAdd}
          />
        </Labelled>
      </section>
    );
  }

  private nextState (newState: State): void {
    this.setState(
      (prevState: State) => {
        const { key = prevState.key, values = prevState.values } = newState;
        const hasParam = key.meta.type.isMap;
        const isValid = values.length === (hasParam ? 1 : 0) &&
          values.reduce((isValid, value) =>
            isValid &&
            !isUndefined(value) &&
            !isUndefined(value.value) &&
            value.isValid,
            true
          );

        return {
          isValid,
          key,
          values,
          params: hasParam
            ? [{ type: getTypeDef(key.meta.type.asMap.key.toString()) }]
            : []
        };
      }
    );
  }

  private onAdd = (): void => {
    const { onAdd } = this.props;
    const { key, values } = this.state;

    onAdd({
      key,
      params: values
    });
  }

  private onChangeKey = (key: StorageFunction): void => {
    this.nextState({
      isValid: false,
      key,
      values: [],
      params: []
    });
  }

  private onChangeParams = (values: RawParams = []): void => {
    this.nextState({ values } as State);
  }
}

export default withMulti(
  Modules,
  translate,
  withApi
);
