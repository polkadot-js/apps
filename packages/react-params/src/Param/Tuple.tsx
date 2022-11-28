// Copyright 2017-2022 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props, RawParam } from '../types';

import React, { useCallback, useState } from 'react';

import { Tuple } from '@polkadot/types';

import Params from '../';
import Base from './Base';
import Static from './Static';
import useParamDefs from './useParamDefs';

function getInitialValues ({ value }: RawParam): RawParam[] {
  return value instanceof Tuple
    ? value.map((value: unknown) => ({ isValid: true, value }))
    : value as RawParam[];
}

function TupleDisplay (props: Props): React.ReactElement<Props> {
  const { className = '', defaultValue, isDisabled, label, onChange, overrides, registry, type, withLabel } = props;
  const params = useParamDefs(registry, type);
  const [values] = useState<RawParam[]>(() => getInitialValues(defaultValue));

  const _onChangeParams = useCallback(
    (values: RawParam[]): void => {
      onChange && onChange({
        isValid: values.reduce<boolean>((result, { isValid }) => result && isValid, true),
        value: values.map(({ value }) => value)
      });
    },
    [onChange]
  );

  if (isDisabled) {
    return <Static {...props} />;
  }

  return (
    <div className='ui--Params-Tuple'>
      <Base
        className={className}
        label={label}
        withLabel={withLabel}
      />
      <Params
        onChange={_onChangeParams}
        overrides={overrides}
        params={params}
        registry={registry}
        values={values}
      />
    </div>
  );
}

export default React.memo(TupleDisplay);
