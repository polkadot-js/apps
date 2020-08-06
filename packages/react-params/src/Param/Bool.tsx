// Copyright 2017-2020 @polkadot/react-params authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React, { useCallback, useMemo, useState } from 'react';
import { Dropdown } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Bare from './Bare';

function BoolParam ({ className = '', defaultValue: { value }, isDisabled, isError, label, onChange, withLabel }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [defaultValue] = useState(
    value instanceof Boolean
      ? value.valueOf()
      : value as boolean
  );

  const options = useMemo(
    () => [
      { text: t<string>('No'), value: false },
      { text: t<string>('Yes'), value: true }
    ],
    [t]
  );

  const _onChange = useCallback(
    (value: boolean) =>
      onChange && onChange({
        isValid: true,
        value
      }),
    [onChange]
  );

  return (
    <Bare className={className}>
      <Dropdown
        className='full'
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={_onChange}
        options={options}
        withEllipsis
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(BoolParam);
