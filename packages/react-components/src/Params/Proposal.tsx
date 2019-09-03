// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props, RawParam } from '@polkadot/react-params/types';

import React, { useContext } from 'react';
import { createType } from '@polkadot/types';
import { ApiContext } from '@polkadot/react-api';

import ExtrinsicDisplay from './Extrinsic';

function onChange ({ onChange }: Props): (_: RawParam) => void {
  return function ({ isValid, value }: RawParam): void {
    let proposal = null;

    if (isValid && value) {
      proposal = createType('Proposal', value);
    }

    onChange && onChange({
      isValid,
      value: proposal
    });
  };
}

export default function ProposalDisplay (props: Props): React.ReactElement<Props> {
  const { apiDefaultTxSudo } = useContext(ApiContext);
  const { className, isDisabled, isError, label, onEnter, style, withLabel } = props;

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
      style={style}
      withLabel={withLabel}
    />
  );
}
