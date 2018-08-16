// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';

import React from 'react';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import AddressMini from '@polkadot/ui-app/AddressMini';
import Card from '@polkadot/ui-app/Card';
import Extrinsic from '@polkadot/ui-app/Extrinsic';

import BlockHeader from '../BlockHeader';
import isHex from '@polkadot/util/is/hex';

type Props = ApiProps & BareProps & {
  chainGetBlock: any,
  value: string
};

// FIXME Duplicated layout here and in democracy, clean up with extrinsics
class BlockByHash extends React.PureComponent<Props> {
  render () {
    const { chainGetBlock, value } = this.props;

    if (!chainGetBlock) {
      return null;
    }

    const { extrinsics, header } = chainGetBlock;

    // TODO Remove, debug info for reverse-engineering
    console.log('hash=', value);
    console.log('block=', chainGetBlock);

    return (
      <div className='explorer--BlockByHash'>
        <BlockHeader
          value={header}
          withExtrinsics
        />
        <div className='explorer--BlockByHash-extrinsics'>
          {extrinsics.map((extrinsic: any, index: number) => (
            <div
              className='explorer--BlockByHash-extrinsic'
              key={`${value}:extrinsic:${index}`}
            >
              <Card>
                <div className='explorer--BlockByHash-extrinsic-header'>
                  <div className='explorer--BlockByHash-extrinsic-header-name'>
                    {extrinsic.extrinsic.section}.{extrinsic.extrinsic.name}
                  </div>
                  <div className='explorer--BlockByHash-extrinsic-header-description'>
                    {extrinsic.extrinsic.description}
                  </div>
                  <div className='explorer--BlockByHash-header-right'>
                    {isHex(extrinsic.address)
                      ? extrinsic.address
                      : <AddressMini value={extrinsic.address} />
                    }
                  </div>
                </div>
                <Extrinsic value={extrinsic} />
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withObservable('chainGetBlock', { paramProp: 'value' })(BlockByHash);
