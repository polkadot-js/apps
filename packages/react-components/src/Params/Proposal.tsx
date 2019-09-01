// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props as BaseProps, RawParam } from '@polkadot/react-params/types';
import { ApiProps } from '@polkadot/react-api/types';

import React from 'react';
import { createType } from '@polkadot/types';
import { withApi } from '@polkadot/react-api';

import ExtrinsicDisplay from './Extrinsic';

type Props = ApiProps & BaseProps;

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

function ProposalDisplay (props: Props): React.ReactElement<Props> {
  const { apiDefaultTxSudo, className, isDisabled, isError, label, onEnter, style, withLabel } = props;

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

export default withApi(ProposalDisplay);
