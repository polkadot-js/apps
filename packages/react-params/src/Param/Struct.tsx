// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props, RawParam } from '../types';

import React, { useCallback } from 'react';

import Params from '../';
import Base from './Base';
import Static from './Static';
import useParamDefs from './useParamDefs';

function StructParam (props: Props): React.ReactElement<Props> {
  const params = useParamDefs(props.registry, props.type);
  const { className = '', isDisabled, label, onChange, overrides, withLabel } = props;

  const _onChangeParams = useCallback(
    (values: RawParam[]): void => {
      onChange && onChange({
        isValid: values.reduce((result: boolean, { isValid }) => result && isValid, true),
        value: params.reduce((value: Record<string, unknown>, { name }, index): Record<string, unknown> => {
          value[name as string] = values[index].value;

          return value;
        }, {})
      });
    },
    [params, onChange]
  );

  if (isDisabled) {
    return <Static {...props} />;
  }

  return (
    <div className='ui--Params-Struct'>
      <Base
        className={className}
        label={label}
        withLabel={withLabel}
      />
      <Params
        onChange={_onChangeParams}
        overrides={overrides}
        params={params}
        registry={props.registry}
      />
    </div>
  );
}

export default React.memo(StructParam);
