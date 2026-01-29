// Copyright 2017-2025 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RawParams } from '@polkadot/react-params/types';
import type { Registry, TypeDef } from '@polkadot/types/types';

import React, { useCallback, useEffect, useState } from 'react';

import UIParams from '@polkadot/react-params';

interface Props {
  isDisabled?: boolean;
  params?: ParamDef[] | null | '';
  onChange: (values: unknown[]) => void;
  onEnter?: () => void;
  registry: Registry;
}

interface ParamDef {
  name: string;
  type: TypeDef;
}

function Params ({ isDisabled, onChange, onEnter, params: propParams, registry }: Props): React.ReactElement<Props> | null {
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
      registry={registry}
    />
  );
}

export default React.memo(Params);
