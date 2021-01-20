// Copyright 2017-2021 @canvas-ui/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Dropdown } from '@canvas-ui/react-components';
import React, { useCallback, useMemo, useState } from 'react';

import { useTranslation } from '../translate';
import { Props } from '../types';
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
