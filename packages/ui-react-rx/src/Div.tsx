// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BaseProps, BareProps } from './types';

import React from 'react';

type Props<T> = BaseProps<T>;

const echoFormatter = (value?: any): string | undefined =>
  value
    ? value.toString()
    : undefined;

export default function Div<T> ({ children, className = 'rx--Div', render = echoFormatter, rxUpdated = false, label = '', style, value }: Props<T>) {
  const props: BareProps = {
    className: [className, rxUpdated ? 'rx--updated' : undefined]
      .filter((c) => c)
      .join(' ') || undefined,
    style
  };

  return (
    <div {...props}>
      {label}{render(value) || ''}{children}
    </div>
  );
}
