// Copyright 2017-2022 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Compact } from '@polkadot/types';
import type { Registry } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { useApi } from '@polkadot/react-hooks';
import { formatBalance, isString } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  children?: React.ReactNode;
  className?: string;
  format?: [number, string];
  formatIndex?: number;
  isShort?: boolean;
  label?: React.ReactNode;
  labelPost?: LabelPost;
  value?: Compact<any> | BN | string | null | 'all';
  valueFormatted?: string;
  withCurrency?: boolean;
  withSi?: boolean;
  isDarwiniaPower?: boolean;
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

function createElement (prefix: string, postfix: string, unit: string, label: LabelPost = '', isShort = false): React.ReactNode {
  return <>{`${prefix}${isShort ? '' : '.'}`}{!isShort && <span className='ui--FormatBalance-postfix'>{`0000${postfix || ''}`.slice(-4)}</span>}<span className='ui--FormatBalance-unit'> {unit}</span>{label}</>;
}

function splitFormat (value: string, label?: LabelPost, isShort?: boolean): React.ReactNode {
  console.log('original=======');
  const [prefix, postfixFull] = value.split('.');
  const [postfix, unit] = postfixFull.split(' ');

  return createElement(prefix, postfix, unit, label, isShort);
}

const splitFormatDarwiniaPower = (amount: string, defaultPowerUnit: string, labelPost?: LabelPost) => {
  const [prefix, postfix] = amount.split('.');

  const processUnit = (amount: string) => {
    const [powerAmount, unit] = amount.split(' ');
    let customPowerUnit: string;

    if (unit) {
      customPowerUnit = unit;
    } else {
      customPowerUnit = defaultPowerUnit;
    }

    return {
      customPowerUnit,
      powerAmount
    };
  };

  if (postfix) {
    // it has decimal, check if it has its own unit
    const { customPowerUnit, powerAmount: decimal } = processUnit(postfix);

    return <>{prefix}{'.'}<span className='ui--FormatBalance-postfix'>{decimal}</span>{' '}<span className={'ui--FormatBalance-unit'}>{customPowerUnit}</span>{labelPost}</>;
  }

  // it has no decimal, process it accordingly
  const { customPowerUnit, powerAmount } = processUnit(prefix);

  return <>{powerAmount}{' '}{customPowerUnit}{labelPost}</>;
};

function applyFormat (value: Compact<any> | BN | string, [decimals, token]: [number, string], withCurrency = true, withSi?: boolean, _isShort?: boolean, labelPost?: LabelPost): React.ReactNode {
  const [prefix, postfix] = formatBalance(value, { decimals, forceUnit: '-', withSi: false }).split('.');
  const isShort = _isShort || (withSi && prefix.length >= K_LENGTH);
  const unitPost = withCurrency ? token : '';

  if (prefix.length > M_LENGTH) {
    const [major, rest] = formatBalance(value, { decimals, withUnit: false }).split('.');
    const minor = rest.substr(0, 4);
    const unit = rest.substr(4);

    return <>{major}.<span className='ui--FormatBalance-postfix'>{minor}</span><span className='ui--FormatBalance-unit'>{unit}{unit ? unitPost : ` ${unitPost}`}</span>{labelPost || ''}</>;
  }

  return createElement(prefix, postfix, unitPost, labelPost, isShort);
}

function FormatBalance ({ children, className = '', format, formatIndex, isDarwiniaPower, isShort, label, labelPost, value, valueFormatted, withCurrency, withSi }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const defaultPowerUnit = t('power', 'power');
  const { api } = useApi();

  const formatInfo = useMemo(
    () => format || getFormat(api.registry, formatIndex),
    [api, format, formatIndex]
  );

  // labelPost here looks messy, however we ensure we have one less text node
  return (
    <div className={`ui--FormatBalance ${className}`}>
      {label ? <>{label}&nbsp;</> : ''}
      <span
        className='ui--FormatBalance-value'
        data-testid='balance-summary'
      >{
          valueFormatted
            ? isDarwiniaPower
              ? splitFormatDarwiniaPower(valueFormatted, defaultPowerUnit, labelPost)
              : splitFormat(valueFormatted, labelPost, isShort)
            : value
              ? value === 'all'
                ? <>{t<string>('everything')}{labelPost || ''}</>
                : applyFormat(value, formatInfo, withCurrency, withSi, isShort, labelPost)
              : isString(labelPost)
                ? `-${labelPost}`
                : labelPost
        }</span>{children}
    </div>
  );
}

export default React.memo(styled(FormatBalance)`
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
    text-transform: uppercase;
  }

  .ui--FormatBalance-value {
    text-align: right;

    > .ui--FormatBalance-postfix {
      font-weight: var(--font-weight-light);
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
`);
