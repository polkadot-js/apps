// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StorageDef$Key } from '@polkadot/storage/types';
import type { I18nProps } from '@polkadot/ui-react-app/types';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import storage from '@polkadot/storage-substrate/keys';
import InputStorage from '@polkadot/ui-react-app/src/InputStorage';

import translate from '../translate';
import Add from './Add';

type Props = I18nProps & {};

type State = {
  value: StorageDef$Key
};

const defaultValue = storage.timestamp.keys.current;

class Selection extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      value: defaultValue
    };
  }

  onChangeStorage = (value: StorageDef$Key): void => {
    this.setState({ value });
  }

  render (): React$Node {
    const { className, style, t } = this.props;
    const { value } = this.state;

    return (
      <div
        className={['storage--Selection', 'storage--actionrow', className].join(' ')}
        style={style}
      >
        <div className='storage--actionrow-value'>
          <div className='ui--form'>
            <div className='full'>
              <InputStorage
                defaultValue={defaultValue}
                labelSection={t('selection.section', {
                  defaultValue: 'query storage area'
                })}
                onChange={this.onChangeStorage}
              />
            </div>
          </div>
        </div>
        <div className='storage--actionrow-button'>
          <Label>&nbsp;</Label>
          <Add value={value} />
        </div>
      </div>
    );
  }
}

export default translate(Selection);
