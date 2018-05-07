// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StorageDef$Key } from '@polkadot/storage/types';
import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { StorageQuery } from './types';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import storage from '@polkadot/storage-substrate/keys';
import InputStorage from '@polkadot/ui-react-app/src/InputStorage';

import translate from './translate';

type Props = I18nProps & {
  onAdd: (query: StorageQuery) => void
};

type State = {
  key: StorageDef$Key
};

const defaultValue = storage.timestamp.keys.current;
let id = -1;

class Selection extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      key: defaultValue
    };
  }

  render (): React$Node {
    const { className, style, t } = this.props;
    const { key } = this.state;

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
            onChange={this.onChangeStorage}
          />
        </div>
        <div className='storage--actionrow-button'>
          <Label>&nbsp;</Label>
          <Button
            disabled={!key}
            icon='plus'
            onClick={this.onAdd}
            primary
          />
        </div>
      </div>
    );
  }

  onAdd = (): void => {
    const { onAdd } = this.props;
    const { key } = this.state;

    onAdd({
      id: ++id,
      key,
      params: []
    });
  }

  onChangeStorage = (key: StorageDef$Key): void => {
    this.setState({ key });
  }
}

export default translate(Selection);
