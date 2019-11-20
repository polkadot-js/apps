// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import styled from 'styled-components';
import Params from '@polkadot/react-params';
import { RawParams } from '@polkadot/react-params/types';
import { getTypeDef } from '@polkadot/types';
import { ComponentMap } from '@polkadot/react-params/types';

interface Props extends BareProps {
  isDisabled?: boolean;
  onChange?: (value: RawParams) => void;
  isError?: boolean;
  onEnter?: () => void;
  overrides?: ComponentMap;
}

const CONTRACTS_PARAMS = [{
  name: "contracts",
  type: getTypeDef("{\"contracts\": \"Vector<AccountId>\" }")
}];

function InputContractList ({ isDisabled, onChange, isError, onEnter, overrides }: Props): React.ReactElement<Props> {
  return (
    <Params
      isDisabled={isDisabled}
      onChange={onChange}
      isError={isError}
      onEnter={onEnter}
      overrides={overrides}
      params={CONTRACTS_PARAMS}
    />
  );
}

export default styled(InputContractList)`
  &&:not(.label-small) .labelExtra {
    right: 6.5rem;
  }

  .ui.action.input.ui--Input .ui.primary.buttons .ui.disabled.button.compact.floating.selection.dropdown.ui--SiDropdown {
    border-style: solid;
    opacity: 1 !important;
  }
`;
