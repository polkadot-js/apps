// Copyright 2017-2018 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { SectionItem } from '@polkadot/params/types';
import { Storages } from '@polkadot/storage/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { RawParams } from '@polkadot/ui-app/Params/types';
import { StorageQuery } from './types';

import React from 'react';

import storage from '@polkadot/storage';
import Button from '@polkadot/ui-app/Button';
import InputStorage from '@polkadot/ui-app/InputStorage';
import Labelled from '@polkadot/ui-app/Labelled';
import Params from '@polkadot/ui-app/Params';
import classes from '@polkadot/ui-app/util/classes';
import isUndefined from '@polkadot/util/is/undefined';

import translate from './translate';

type Props = I18nProps & {
  onAdd: (query: StorageQuery) => void
};

type State = {
  isValid: boolean,
  key: SectionItem<Storages>,
  params: RawParams
};

const defaultValue = storage.timestamp.public.now;
let id = -1;

class Selection extends React.PureComponent<Props, State> {
  state: State = {
    isValid: true,
    key: defaultValue,
    params: []
  };

  render () {
    const { className, style, t } = this.props;
    const { isValid, key } = this.state;

    return (
      <div
        className={classes('storage--Selection', 'storage--actionrow', className)}
        style={style}
      >
        <div className='storage--actionrow-value'>
          <InputStorage
            defaultValue={defaultValue}
            labelSection={t('selection.section', {
              defaultValue: 'query storage area'
            })}
            onChange={this.onChangeKey}
          />
          <Params
            item={key}
            key={`${key.section}.${key.name}`}
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
      </div>
    );
  }

  nextState (newState: State): void {
    this.setState(
      (prevState: State) => {
        const { key = prevState.key, params = prevState.params } = newState;
        const keyParams = Object.values(key.params);
        const isValid = params.length === keyParams.length &&
          keyParams.reduce((isValid, param, index) =>
            isValid &&
            !isUndefined(params[index]) &&
            !isUndefined(params[index].value) &&
            params[index].isValid, true);

        return {
          isValid,
          key,
          params
        };
      }
    );
  }

  onAdd = (): void => {
    const { onAdd } = this.props;
    const { key, params } = this.state;

    onAdd({
      id: ++id,
      key,
      params
    });
  }

  onChangeKey = (key: SectionItem<Storages>): void => {
    this.nextState({
      isValid: false,
      key,
      params: []
    });
  }

  onChangeParams = (params: RawParams = []): void => {
    this.nextState({ params } as State);
  }
}

export default translate(Selection);
