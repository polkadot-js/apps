// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-api/types';

import BN from 'bn.js';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Compact } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props extends BareProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  value?: Compact<any> | BN | string | null | 'all';
  withSi?: boolean;
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

function formatSi (value: Compact<any> | BN | string): React.ReactNode {
  const strValue = ((value as Compact<any>).toBn ? (value as Compact<any>).toBn() : value).toString();
  const [prefix, postfix] = strValue === '0'
    ? ['0', '0']
    : formatBalance(value, { withSi: false }).split('.');
  const unit = strValue === '0'
    ? ''
    : formatBalance.calcSi(strValue).value;

  return <>{prefix}.<span className='balance-postfix'>{`000${postfix || ''}`.slice(-3)}</span>{unit === '-' ? '' : unit}</>;
}

function FormatBalance ({ children, className, label, value, withSi }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [currency] = useState(formatBalance.getDefaults().unit);

  return (
    <div className={`ui--FormatBalance ${className}`}>
      {label || ''}{
        value
          ? value === 'all'
            ? t('all available')
            : withSi
              ? formatSi(value)
              : format(value, currency)
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
