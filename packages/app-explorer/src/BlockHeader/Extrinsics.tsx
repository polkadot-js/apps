// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { withCall, withMulti } from '@polkadot/ui-api/index';

import translate from '../translate';

type Props = I18nProps & {
  hash: Uint8Array,
  chain_getBlock: any
};

class Extrinsics extends React.PureComponent<Props> {
  render () {
    const { chain_getBlock, t } = this.props;

    if (!chain_getBlock || !chain_getBlock.extrinsics) {
      return null;
    }

    return (
      <tr>
        <td className='type'>extrinsics</td>
        <td className='hash'>
          {t('{{count}} in block', {
            replace: {
              count: chain_getBlock.extrinsics.length
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
  withCall('rpc.chain.getBlock', { paramName: 'hash' })
);
