// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-api/types';

import BN from 'bn.js';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Compact } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';

interface Props extends BareProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  value?: Compact<any> | BN | string | null;
}

// for million, 2 * 3-grouping + comma
const M_LENGTH = 6 + 1;

function format (value: Compact<any> | BN | string, currency: string): React.ReactNode {
  const [prefix, postfix] = formatBalance(value, { forceUnit: '-', withSi: false }).split('.');

  if (prefix.length > M_LENGTH) {
    // TODO Format with balance-postfix
    return formatBalance(value);
  }

  return <>{prefix}.<span className='balance-postfix'>{`000${postfix || ''}`.slice(-3)}</span> {currency}</>;
}

function FormatBalance ({ children, className, label, value }: Props): React.ReactElement<Props> {
  const [currency] = useState(formatBalance.getDefaults().unit);

  return (
    <div className={`ui--FormatBalance ${className}`}>
      {label || ''}{
        value
          ? format(value, currency)
          : '-'
      }{children}
    </div>
  );
}

export default styled(FormatBalance)`
  display: inline-block;
  vertical-align: baseline;

  * {
    vertical-align: baseline !important;
  }

  > label,
  > .label {
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: baseline;
  }

  > .balance-postfix {
    font-weight: 100;
    opacity: 0.75;
    vertical-align: baseline;
  }
`;
