// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import { DropdownOptions } from '../util/types';

import React, { useCallback } from 'react';
import ApiPromise from '@polkadot/api/promise';

import Dropdown from '../Dropdown';
import { classes } from '../util';

interface Props {
  api: ApiPromise;
  className?: string;
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
