// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { withCall, withMulti } from '@polkadot/ui-react-rx/with/index';

import translate from '../translate';

type Props = I18nProps & {
  hash: Uint8Array,
  rpc_chain_getBlock: any
};

class Extrinsics extends React.PureComponent<Props> {
  render () {
    const { rpc_chain_getBlock, t } = this.props;

    if (!rpc_chain_getBlock || !rpc_chain_getBlock.extrinsics) {
      return null;
    }

    return (
      <tr>
        <td className='type'>extrinsics</td>
        <td className='hash'>
          {t('extrinsics.count', {
            defaultValue: '{{count}} in block',
            replace: {
              count: rpc_chain_getBlock.extrinsics.length
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
  withCall('rpc.chain.getBlock', { paramProp: 'hash' })
);
