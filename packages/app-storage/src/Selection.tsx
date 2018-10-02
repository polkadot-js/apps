// Copyright 2017-2018 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { StorageFunction } from '@polkadot/types/StorageKey';
import { I18nProps } from '@polkadot/ui-app/types';
import { RawParams } from '@polkadot/ui-app/Params/types';
import { StorageQuery } from './types';

import React from 'react';

// FIXME Swap to dynamic via fromMetadata
import storage from '@polkadot/storage/testing';
import Button from '@polkadot/ui-app/Button';
import InputStorage from '@polkadot/ui-app/InputStorage';
import Labelled from '@polkadot/ui-app/Labelled';
import Params from '@polkadot/ui-app/Params';
import isUndefined from '@polkadot/util/is/undefined';

import translate from './translate';

type Props = I18nProps & {
  onAdd: (query: StorageQuery) => void
};

type State = {
  isValid: boolean,
  key: StorageFunction,
  params: RawParams
};

const defaultValue = storage.timestamp.now;
let id = -1;

class Selection extends React.PureComponent<Props, State> {
  state: State = {
    isValid: true,
    key: defaultValue,
    params: []
  };

  render () {
    const { t } = this.props;
    const { isValid, key } = this.state;

    return (
      <section className='storage--Selection storage--actionrow'>
        <div className='storage--actionrow-value'>
          <InputStorage
            defaultValue={defaultValue}
            labelSection={t('selection.section', {
              defaultValue: 'query state section'
            })}
            onChange={this.onChangeKey}
          />
          <Params
            item={key}
            onChange={this.onChangeParams}
          />
        </div>
        <Labelled className='storage--actionrow-button'>
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
        const { key = prevState.key, params = prevState.params } = newState;
        const hasParam = key.meta.type.isMap;
        const isValid = params.length === (hasParam ? 1 : 0) &&
          params.reduce((isValid, param) =>
            isValid &&
            !isUndefined(param) &&
            !isUndefined(param.value) &&
            param.isValid,
            true
          );

        return {
          isValid,
          key,
          params
        };
      }
    );
  }

  private onAdd = (): void => {
    const { onAdd } = this.props;
    const { key, params } = this.state;

    onAdd({
      id: ++id,
      key,
      params
    });
  }

  private onChangeKey = (key: StorageFunction): void => {
    this.nextState({
      isValid: false,
      key,
      params: []
    });
  }

  private onChangeParams = (params: RawParams = []): void => {
    this.nextState({ params } as State);
  }
}

export default translate(Selection);
