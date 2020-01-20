// Copyright 2017-2020 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props, RawParam } from '@polkadot/react-params/types';

import React from 'react';
import { createType } from '@polkadot/types';
import { registry } from '@polkadot/react-api';
import { useApi } from '@polkadot/react-hooks';

import ExtrinsicDisplay from './Extrinsic';

function onChange ({ onChange }: Props): (_: RawParam) => void {
  return function ({ isValid, value }: RawParam): void {
    let proposal = null;

    if (isValid && value) {
      proposal = createType(registry, 'Proposal', value);
    }

    onChange && onChange({
      isValid,
      value: proposal
    });
  };
}

export default function ProposalDisplay (props: Props): React.ReactElement<Props> {
  const { apiDefaultTxSudo } = useApi();
  const { className, isDisabled, isError, label, onEnter, onEscape, style, withLabel } = props;

  return (
    <ExtrinsicDisplay
      className={className}
      defaultValue={apiDefaultTxSudo}
      isDisabled={isDisabled}
      isError={isError}
      isPrivate
      label={label}
      onChange={onChange(props)}
      onEnter={onEnter}
      onEscape={onEscape}
      style={style}
      withLabel={withLabel}
    />
  );
}
