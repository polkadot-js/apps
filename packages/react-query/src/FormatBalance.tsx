// Copyright 2017-2019 @polkadot/react-query authors & contributors
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

function format (value: Compact<any> | BN | string, unit: string): React.ReactNode {
  const [prefix, postfix] = formatBalance(value, { forceUnit: '-', withSi: false }).split('.');

  return (
    <span className='value'><span className='prefix'>{prefix}</span><span className='postfix'>.{`000${postfix || ''}`.slice(-3)}</span><span className='units'>&nbsp;{unit}</span></span>
  );
}

export function FormatBalance ({ children, className, label = '', value }: Props): React.ReactElement<Props> {
  const [unit] = useState(formatBalance.getDefaults().unit);

  return (
    <div className={className}>
      {label}{
        value
          ? format(value, unit)
          : <span><span className='postfix'>-</span><span className='units'>&nbsp;{unit}</span></span>
      }{children}
    </div>
  );
}

export default styled(FormatBalance)`
  display: inline-block;
  vertical-align: middle;

  * {
    display: inline-block;
    vertical-align: middle;
  }

  .value {
    .postfix {
      opacity: 0.75;
    }
  }
`;
