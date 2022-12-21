// Copyright 2017-2022 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props, RawParam } from '../types';

import React, { useCallback, useState } from 'react';

import { Struct } from '@polkadot/types';
import { isCodec } from '@polkadot/util';

import Params from '../';
import Base from './Base';
import useParamDefs from './useParamDefs';

function extractValues ({ isValid, value }: RawParam): RawParam[] | undefined {
  return (isValid && isCodec(value) && value instanceof Struct)
    ? value.toArray().map((value) => ({ isValid: true, value }))
    : undefined;
}

function StructParam (props: Props): React.ReactElement<Props> {
  const params = useParamDefs(props.registry, props.type);
  const { className = '', defaultValue, isDisabled, label, onChange, overrides, withLabel } = props;
  const [values] = useState(() => extractValues(defaultValue));

  const _onChangeParams = useCallback(
    (values: RawParam[]): void => {
      if (isDisabled) {
        return;
      }

      onChange && onChange({
        isValid: values.reduce((result: boolean, { isValid }) => result && isValid, true),
        value: params.reduce((value: Record<string, unknown>, { name }, index): Record<string, unknown> => {
          value[name as string] = values[index].value;

          return value;
        }, {})
      });
    },
    [isDisabled, params, onChange]
  );

  return (
    <div className='ui--Params-Struct'>
      <Base
        className={className}
        label={label}
        withLabel={withLabel}
      />
      <Params
        isDisabled={isDisabled}
        onChange={_onChangeParams}
        overrides={overrides}
        params={params}
        registry={props.registry}
        values={values}
      />
    </div>
  );
}

export default React.memo(StructParam);
