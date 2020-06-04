import React from 'react';
import { Compact } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';

// Format GA balances for CENNZnet
export default function formatGenericAssetBalance (value: Compact<any> | BN | string, symbol: string): React.ReactNode {
    const [prefix, postfix] = formatBalance(value, { forceUnit: '-', withSi: false }).split('.');
  
    return <>{prefix}.<span className='balance-postfix'>{`000000000${postfix || ''}`.slice(-4)}</span> {symbol}</>;
  }