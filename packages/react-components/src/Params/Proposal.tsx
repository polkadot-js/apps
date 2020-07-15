// Copyright 2017-2020 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props, RawParam } from '@polkadot/react-params/types';

import React, { useCallback } from 'react';
import { registry } from '@polkadot/react-api';
import { useApi } from '@polkadot/react-hooks';

import ExtrinsicDisplay from './Extrinsic';

function ProposalDisplay ({ className = '', isDisabled, isError, label, onChange, onEnter, onEscape, withLabel }: Props): React.ReactElement<Props> {
  const { apiDefaultTxSudo } = useApi();

  const _onChange = useCallback(
    ({ isValid, value }: RawParam): void => {
      let proposal = null;

      if (isValid && value) {
        proposal = registry.createType('Proposal', value);
      }

      onChange && onChange({
        isValid,
        value: proposal
      });
    },
    [onChange]
  );

  return (
    <ExtrinsicDisplay
      className={className}
      defaultValue={apiDefaultTxSudo}
      isDisabled={isDisabled}
      isError={isError}
      isPrivate
      label={label}
      onChange={_onChange}
      onEnter={onEnter}
      onEscape={onEscape}
      withLabel={withLabel}
    />
  );
}

export default React.memo(ProposalDisplay);
