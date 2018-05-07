// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StorageDef$Key } from '@polkadot/storage/types';
import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { RawParams } from '@polkadot/ui-react-app/Params/types';
import type { StorageQuery } from './types';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import Label from 'semantic-ui-react/dist/es/elements/Label';
// import encode from '@polkadot/extrinsics-codec/encode/params';
import storage from '@polkadot/storage-substrate/keys';
import InputStorage from '@polkadot/ui-react-app/src/InputStorage';
import Params from '@polkadot/ui-react-app/src/Params';
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
  constructor (props: Props) {
    super(props);

    this.state = ({
      key: defaultValue
    }: $Shape<State>);
  }

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
        <div className='storage--actionrow-button'>
          <Label>&nbsp;</Label>
          <Button
            disabled={!isValid}
            icon='plus'
            onClick={this.onAdd}
            primary
          />
        </div>
      </div>
    );
  }

  nextState (newState: $Shape<State>): void {
    this.setState(
      (prevState: State) => {
        const { key = prevState.key, params = prevState.params } = newState;
        const keyParams = Object.values(key.params || {});
        const valParams = params || [];
        const isValid = valParams.length === keyParams.length &&
          keyParams.reduce((isValid, param, index) =>
            isValid &&
            !isUndefined(valParams[index]) &&
            !isUndefined(valParams[index].value) &&
            valParams[index].isValid, true);

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
