// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Codec } from '@polkadot/types/types';
import { Props as BareProps, RawParam } from '../types';

import React from 'react';
import styled from 'styled-components';
import { Static } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Bare from './Bare';

interface Props extends BareProps {
  asHex?: boolean;
  children?: React.ReactNode;
  defaultValue: RawParam;
  withLabel?: boolean;
}

function StaticParam ({ asHex, children, className = '', defaultValue, label }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const value = defaultValue && defaultValue.value && (
    asHex
      ? (defaultValue.value as Codec).toHex()
      : JSON.stringify(
        (defaultValue.value as { toHuman?: () => unknown }).toHuman
          ? (defaultValue.value as Codec).toHuman()
          : defaultValue.value,
        null, 2
      ).replace(/"/g, '').replace(/\\/g, '').replace(/\],\[/g, '],\n[')
  );

  return (
    <Bare className={className}>
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
