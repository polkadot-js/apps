// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import withMulti from '@polkadot/ui-react-rx/with/multi';
import withObservable from '@polkadot/ui-react-rx/with/observable';

import translate from '../translate';

type Props = I18nProps & {
  hash: Uint8Array,
  getBlock: any
};

class Extrinsics extends React.PureComponent<Props> {
  render () {
    const { getBlock, t } = this.props;

    if (!getBlock || !getBlock.extrinsics) {
      return null;
    }

    return (
      <tr>
        <td className='type'>extrinsics</td>
        <td className='hash'>
          {t('extrinsics.count', {
            defaultValue: '{{count}} in block',
            replace: {
              count: getBlock.extrinsics.length
            }
          })}
        </td>
      </tr>
    );
  }

}

export default withMulti(
  Extrinsics,
  translate,
  withObservable('getBlock', { paramProp: 'hash' })
);
