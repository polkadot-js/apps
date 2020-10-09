// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TypeDef } from '@polkadot/types/types';
import { RawParams } from '@polkadot/react-params/types';

import React, { useCallback, useEffect, useState } from 'react';
import UIParams from '@polkadot/react-params';

interface Props {
  isDisabled?: boolean;
  params?: ParamDef[];
  onChange: (values: any[]) => void;
  onEnter?: () => void;
}

interface ParamDef {
  name: string;
  type: TypeDef;
}

function Params ({ isDisabled, onChange, onEnter, params: propParams }: Props): React.ReactElement<Props> | null {
  const [params, setParams] = useState<ParamDef[]>([]);

  useEffect((): void => {
    propParams && setParams(propParams);
  }, [propParams]);

  const _onChange = useCallback(
    (values: RawParams) => onChange(values.map(({ value }) => value)),
    [onChange]
  );

  if (!params.length) {
    return null;
  }

  return (
    <UIParams
      isDisabled={isDisabled}
      onChange={_onChange}
      onEnter={onEnter}
      params={params}
    />
  );
}

export default React.memo(Params);
