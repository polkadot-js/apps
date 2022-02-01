// Copyright 2017-2022 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Codec } from '@polkadot/types/types';
import type { RawParam } from '../types';

import React from 'react';
import styled from 'styled-components';

import { Static } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import { toHumanJson } from '../valueToText';
import Bare from './Bare';

interface Props {
  asHex?: boolean;
  children?: React.ReactNode;
  childrenPre?: React.ReactNode;
  className?: string;
  defaultValue: RawParam;
  label?: React.ReactNode;
  withLabel?: boolean;
}

function StaticParam ({ asHex, children, childrenPre, className = '', defaultValue, label }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const value = defaultValue && (defaultValue.value as string) && (
    asHex
      ? (defaultValue.value as Codec).toHex()
      : toHumanJson(
        (defaultValue.value as { toHuman?: () => unknown }).toHuman
          ? (defaultValue.value as Codec).toHuman()
          : defaultValue.value
      )
  );

  return (
    <Bare className={className}>
      {childrenPre}
      <Static
        className='full'
        label={label}
        value={<pre>{value || t<string>('<empty>')}</pre>}
      />
      {children}
    </Bare>
  );
}

export default React.memo(styled(StaticParam)`
  pre {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ui--Static {
    margin-bottom: 0 !important;
  }
`);
