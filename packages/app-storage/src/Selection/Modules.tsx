// Copyright 2017-2019 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StorageEntryPromise } from '@polkadot/api/types';
import { TypeDef, getTypeDef } from '@polkadot/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { RawParams } from '@polkadot/ui-params/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { ComponentProps } from '../types';

import React from 'react';
import { Button, InputStorage, TxComponent } from '@polkadot/ui-app';
import Params from '@polkadot/ui-params';
import { withApi, withMulti } from '@polkadot/ui-api';
import { isUndefined } from '@polkadot/util';

import translate from '../translate';

type Props = ComponentProps & ApiProps & I18nProps;

interface State {
  isValid: boolean;
  key: StorageEntryPromise;
  values: RawParams;
  params: { type: TypeDef }[];
}

class Modules extends TxComponent<Props, State> {
  private defaultValue: any;

  public state: State;

  public constructor (props: Props) {
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

  public render (): React.ReactNode {
    const { t } = this.props;
    const { isValid, key: { creator: { method, section, meta } }, params } = this.state;

    return (
      <section className='storage--actionrow'>
        <div className='storage--actionrow-value'>
          <InputStorage
            defaultValue={this.defaultValue}
            label={t('selected state query')}
            onChange={this.onChangeKey}
            help={meta && meta.documentation && meta.documentation.join(' ')}
          />
          <Params
            key={`${section}.${method}:params` /* force re-render on change */}
            onChange={this.onChangeParams}
            onEnter={this.submit}
            params={params}
          />
        </div>
        <div className='storage--actionrow-buttons'>
          <Button
            icon='plus'
            isDisabled={!isValid}
            isPrimary
            onClick={this.onAdd}
            ref={this.button}
          />
        </div>
      </section>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState(
      (prevState: State): Pick<State, never> => {
        const { key = prevState.key, values = prevState.values } = newState;
        const hasParam = key.creator.meta.type.isMap;
        const isValid = values.length === (hasParam ? 1 : 0) &&
          values.reduce(
            (isValid, value): boolean =>
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
            ? [{ type: getTypeDef(key.creator.meta.type.asMap.key.toString()) }]
            : []
        };
      }
    );
  }

  private onAdd = (): void => {
    const { onAdd } = this.props;
    const { key, values } = this.state;

    onAdd({
      isConst: false,
      key,
      params: values
    });
  }

  private onChangeKey = (key: StorageEntryPromise): void => {
    this.nextState({
      isValid: false,
      key,
      values: [],
      params: []
    });
  }

  private onChangeParams = (values: RawParams = []): void => {
    this.nextState({ values });
  }
}

export default withMulti(
  Modules,
  translate,
  withApi
);
