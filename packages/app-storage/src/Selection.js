// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StorageDef$Key } from '@polkadot/storage/types';
import type { I18nProps } from '@polkadot/ui-app/types';
import type { RawParams } from '@polkadot/ui-app/Params/types';
import type { StorageQuery } from './types';

import React from 'react';

import storage from '@polkadot/storage-substrate/keys';
import Button from '@polkadot/ui-app/src/Button';
import InputStorage from '@polkadot/ui-app/src/InputStorage';
import Labelled from '@polkadot/ui-app/src/Labelled';
import Params from '@polkadot/ui-app/src/Params';
import isUndefined from '@polkadot/util/is/undefined';

import translate from './translate';

type Props = I18nProps & {
  onAdd: (query: StorageQuery) => void
};

type State = {
  isValid: boolean,
  key: StorageDef$Key,
  params: RawParams
};

const defaultValue = storage.timestamp.keys.current;
let id = -1;

class Selection extends React.PureComponent<Props, State> {
  state: State = ({
    key: defaultValue,
    params: []
  }: $Shape<State>);

  render (): React$Node {
    const { className, style, t } = this.props;
    const { isValid, key } = this.state;

    return (
      <div
        className={['storage--Selection', 'storage--actionrow', className].join(' ')}
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

  nextState (newState: $Shape<State>): void {
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

  onChangeKey = (key: StorageDef$Key): void => {
    this.nextState({ key });
  }

  onChangeParams = (params?: RawParams = []): void => {
    this.nextState({ params });
  }
}

export default translate(Selection);
