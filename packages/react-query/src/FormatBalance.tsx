// Copyright 2017-2025 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Compact } from '@polkadot/types';
import type { Registry } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { styled } from '@polkadot/react-components/styled';
import { useApi } from '@polkadot/react-hooks';
import { formatBalance, isString } from '@polkadot/util';

import { useTranslation } from './translate.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  format?: [decimals: number, unit: string];
  formatIndex?: number;
  isShort?: boolean;
  label?: React.ReactNode;
  labelPost?: LabelPost;
  useTicker?: boolean;
  value?: Compact<any> | BN | string | number | null;
  valueFormatted?: string;
  withCurrency?: boolean;
  withSi?: boolean;
}

// for million, 2 * 3-grouping + comma
const M_LENGTH = 6 + 1;
const K_LENGTH = 3 + 1;

type LabelPost = string | React.ReactNode

function getFormat (registry: Registry, formatIndex = 0): [number, string] {
  const decimals = registry.chainDecimals;
  const tokens = registry.chainTokens;

  return [
    formatIndex < decimals.length
      ? decimals[formatIndex]
      : decimals[0],
    formatIndex < tokens.length
      ? tokens[formatIndex]
      : tokens[1]
  ];
}

function createElement (prefix: string, postfix: string, unit: string, label: LabelPost = '', isShort = false, ticker?: string): React.ReactNode {
  if (ticker) {
    return <>{`${prefix}${isShort ? '' : '.'}`}{!isShort && <span className='ui--FormatBalance-postfix'>{`${postfix || ''}`.slice(-4)}</span>}<span className='ui--FormatBalance-unit'> {ticker}</span>{label}</>;
  } else {
    return <>{`${prefix}${isShort ? '' : '.'}`}{!isShort && <span className='ui--FormatBalance-postfix'>{`0000${postfix || ''}`.slice(-4)}</span>}<span className='ui--FormatBalance-unit'> {unit}</span>{label}</>;
  }
}

function splitFormat (value: string, label?: LabelPost, isShort?: boolean): React.ReactNode {
  const [prefix, postfixFull] = value.split('.');
  const [postfix, unit] = postfixFull.split(' ');

  return createElement(prefix, postfix, unit, label, isShort);
}

function applyFormat (value: Compact<any> | BN | string | number, [decimals, token]: [number, string], withCurrency = true, withSi?: boolean, _isShort?: boolean, labelPost?: LabelPost, useTicker?: boolean): React.ReactNode {
  const [prefix, postfix, ticker] = formatBalance(value, { decimals, forceUnit: '-', withSi: false }).split('.');
  const isShort = _isShort || (withSi && prefix.length >= K_LENGTH);
  const unitPost = withCurrency ? token : '';

  if (prefix.length > M_LENGTH) {
    const [major, rest] = formatBalance(value, { decimals, withUnit: false }).split('.');
    const minor = rest.substring(0, 4);
    const unit = rest.substring(4);

    return <>{major}.<span className='ui--FormatBalance-postfix'>{minor}</span><span className='ui--FormatBalance-unit'>{unit}{unit ? unitPost : ` ${unitPost}`}</span>{labelPost || ''}</>;
  }

  if (useTicker) {
    return createElement(prefix, postfix, unitPost, labelPost, isShort, ticker);
  } else {
    return createElement(prefix, postfix, unitPost, labelPost, isShort);
  }
}

function FormatBalance ({ children, className = '', format, formatIndex, isShort, label, labelPost, useTicker, value, valueFormatted, withCurrency, withSi }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  const formatInfo = useMemo(
    () => format || getFormat(api.registry, formatIndex),
    [api, format, formatIndex]
  );

  // labelPost here looks messy, however we ensure we have one less text node
  return (
    <StyledSpan className={`${className} ui--FormatBalance`}>
      {label ? <>{label}&nbsp;</> : ''}
      <span
        className='ui--FormatBalance-value --digits'
        data-testid='balance-summary'
      >{
          valueFormatted
            ? splitFormat(valueFormatted, labelPost, isShort)
            : value
              ? value === 'all'
                ? <>{t('everything')}{labelPost || ''}</>
                : applyFormat(value, formatInfo, withCurrency, withSi, isShort, labelPost, useTicker)
              : isString(labelPost)
                ? `-${labelPost.toString()}`
                : labelPost
        }</span>{children}
    </StyledSpan>
  );
}

const StyledSpan = styled.span`
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
    font-size: var(--font-percent-tiny);
  }

  .ui--FormatBalance-value {
    text-align: right;

    > .ui--FormatBalance-postfix {
      font-weight: lighter;
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
`;

export default React.memo(FormatBalance);
