// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from './types';

import React from 'react';

import Account from './Account';
import Amount from './Amount';
import Proposal from './Proposal';
import Unknown from './Unknown';

type Props = BaseProps & {
  label?: string;
}

const Components = {
  'AccountId': Account,
  'Balance': Amount,
  'BlockNumber': Amount,
  'Bytes': Unknown,
  'Proposal': Proposal,
  'u32': Amount,
  'u64': Amount
};

export default function Param ({ className, label, style, subject, value }: Props): React$Node {
  // flowlint-next-line sketchy-null-string:off
  const defaultLabel = label || `${value.name}: ${value.type}`;
  const Component = Components[value.type];

  return (
    <Component
      className={className}
      label={defaultLabel}
      style={style}
      subject={subject}
      value={value}
    />
  );
}
