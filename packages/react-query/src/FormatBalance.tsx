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

function format (value: Compact<any> | BN | string): string {
  const [prefix, postfix] = formatBalance(value, { forceUnit: '-', withSi: false }).split('.');

  return `${prefix}.${`000${postfix || ''}`.slice(-3)}`;
}

export function FormatBalance ({ children, className, label = '', value }: Props): React.ReactElement<Props> {
  const [unit] = useState(formatBalance.getDefaults().unit);

  return (
    <div className={className}>
      {label}{
        value
          ? format(value)
          : '-'
      }&nbsp;{unit}{children}
    </div>
  );
}

export default styled(FormatBalance)`
  display: inline;
  vertical-align: middle;

  * {
    vertical-align: baseline;
  }

  > label,
  > .label {
    display: inline;
    margin-right: 0.25rem;
    vertical-align: baseline;
  }
`;
