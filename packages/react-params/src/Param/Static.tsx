// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WithTranslation } from 'react-i18next';
import { Props as BareProps, RawParam } from '../types';

import React, { useEffect, useState } from 'react';
import { Static } from '@polkadot/react-components';

import translate from '../translate';
import Bare from './Bare';

interface Props extends BareProps, WithTranslation {
  asHex?: boolean;
  defaultValue: RawParam | null;
  withLabel?: boolean;
}

function getDisplayValue (defaultValue: RawParam | null, asHex?: boolean): string | null {
  return defaultValue && defaultValue.value
    ? defaultValue.value[asHex ? 'toHex' : 'toString']()
    : null;
}

function StaticParam ({ asHex, className, defaultValue, label, style, t }: Props): React.ReactElement<Props> {
  const [displayValue, setDisplayValue] = useState<string | null>(getDisplayValue(defaultValue, asHex));

  useEffect((): void => {
    const newValue = getDisplayValue(defaultValue, asHex);

    if (newValue !== displayValue) {
      setDisplayValue(newValue);
    }
  }, [asHex, defaultValue, displayValue]);

  return (
    <Bare
      className={className}
      style={style}
    >
      <Static
        className='full'
        label={label}
        value={displayValue || t('<empty>')}
      />
    </Bare>
  );
}

export default translate(StaticParam);
