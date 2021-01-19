// Copyright 2017-2021 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '@polkadot/react-components/types';
import type { Compact } from '@polkadot/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';

import { formatBalance } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  children?: React.ReactNode;
  className?: string;
  isShort?: boolean;
  label?: React.ReactNode;
  labelPost?: string;
  value?: Compact<any> | BN | string | null | 'all';
  valueFormatted?: string;
  withCurrency?: boolean;
  withSi?: boolean;
}

// for million, 2 * 3-grouping + comma
const M_LENGTH = 6 + 1;
const K_LENGTH = 3 + 1;

function formatDisplay (prefix: string, postfix: string, unit: string, label = '', isShort = false): React.ReactNode {
  return <>{`${prefix}${isShort ? '' : '.'}`}{!isShort && <span className='ui--FormatBalance-postfix'>{`0000${postfix || ''}`.slice(-4)}</span>}<span className='ui--FormatBalance-unit'> {unit}</span>{label}</>;
}

function splitFormat (value: string, label?: string, isShort?: boolean): React.ReactNode {
  const [prefix, postfixFull] = value.split('.');
  const [postfix, unit] = postfixFull.split(' ');

  return formatDisplay(prefix, postfix, unit, label, isShort);
}

function format (value: Compact<any> | BN | string, withCurrency = true, withSi?: boolean, _isShort?: boolean, labelPost?: string): React.ReactNode {
  const [prefix, postfix] = formatBalance(value, { forceUnit: '-', withSi: false }).split('.');
  const isShort = _isShort || (withSi && prefix.length >= K_LENGTH);
  const unitPost = withCurrency ? formatBalance.getDefaults().unit : '';

  if (prefix.length > M_LENGTH) {
    const [major, rest] = formatBalance(value, { withUnit: false }).split('.');
    const minor = rest.substr(0, 4);
    const unit = rest.substr(4);

    return <>{major}.<span className='ui--FormatBalance-postfix'>{minor}</span><span className='ui--FormatBalance-unit'>{unit}{unit ? unitPost : ` ${unitPost}`}</span>{labelPost || ''}</>;
  }

  return formatDisplay(prefix, postfix, unitPost, labelPost, isShort);
}

function FormatBalance ({ children, className = '', isShort, label, labelPost, value, valueFormatted, withCurrency, withSi }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  // labelPost here looks messy, however we ensure we have one less text node
  return (
    <div className={`ui--FormatBalance ${className}`}>
      {label ? <>{label}&nbsp;</> : ''}<span className='ui--FormatBalance-value'>{
        valueFormatted
          ? splitFormat(valueFormatted, labelPost, isShort)
          : value
            ? value === 'all'
              ? t<string>('everything{{labelPost}}', { replace: { labelPost } })
              : format(value, withCurrency, withSi, isShort, labelPost)
            : `-${labelPost || ''}`
      }</span>{children}
    </div>
  );
}

export default React.memo(styled(FormatBalance)(({ theme }: ThemeProps) => `
  display: inline-block;
  vertical-align: baseline;
  white-space: nowrap;

  * {
    vertical-align: baseline !important;
  }

  > label,
  > .label {
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: baseline;
  }

  .ui--FormatBalance-unit {
    font-size: 0.825em;
  }

  .ui--FormatBalance-value {
    text-align: right;

    > .ui--FormatBalance-postfix {
      font-weight: ${theme.fontWeightLight};
      opacity: 0.7;
      vertical-align: baseline;
    }
  }

  > .ui--Button {
    margin-left: 0.25rem;
  }

  .ui--Icon {
    margin-bottom: -0.25rem;
    margin-top: 0.25rem;
  }

  .ui--Icon+.ui--FormatBalance-value {
    margin-left: 0.375rem;
  }
`));
