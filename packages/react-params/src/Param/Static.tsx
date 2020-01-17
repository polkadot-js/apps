// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props as BareProps, RawParam } from '../types';

import React from 'react';
import { Static } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Bare from './Bare';

interface Props extends BareProps {
  asHex?: boolean;
  children?: React.ReactNode;
  defaultValue: RawParam;
  withLabel?: boolean;
}

export default function StaticParam ({ asHex, children, className, defaultValue, label, style }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const value = defaultValue && defaultValue.value && defaultValue.value[asHex ? 'toHex' : 'toString']();

  return (
    <Bare
      className={className}
      style={style}
    >
      <Static
        className='full'
        label={label}
        value={value || t('<empty>')}
      />
      {children}
    </Bare>
  );
}
