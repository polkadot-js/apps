// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DropdownOptions } from '@canvas-ui/react-util/types';
import { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import { BareProps } from '../types';

import React, { useCallback } from 'react';
import ApiPromise from '@polkadot/api/promise';

import Dropdown from '../Dropdown';
import { classes } from '@canvas-ui/react-util';

interface Props extends BareProps {
  api: ApiPromise;
  isError?: boolean;
  onChange: (value: SubmittableExtrinsicFunction<'promise'>) => void;
  options: DropdownOptions;
  value: SubmittableExtrinsicFunction<'promise'>;
}

function SelectMethod ({ api, className = '', isError, onChange, options, value }: Props): React.ReactElement<Props> | null {
  const transform = useCallback(
    (method: string): SubmittableExtrinsicFunction<'promise'> =>
      api.tx[value.section][method],
    [api, value]
  );

  if (!options.length) {
    return null;
  }

  return (
    <Dropdown
      className={classes('ui--DropdownLinked-Items', className)}
      isError={isError}
      onChange={onChange}
      options={options}
      transform={transform}
      value={value.method}
      withLabel={false}
    />
  );
}

export default React.memo(SelectMethod);
