// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';

import LabelHelp from './LabelHelp';

interface Props extends BareProps {
  help?: React.ReactNode;
  label?: React.ReactNode;
  withEllipsis?: boolean;
}

export default function Label ({ className, help, label, withEllipsis }: Props): React.ReactElement<Props> {
  return (
    <label className={className}>
      {
        withEllipsis
          ? <div className='withEllipsis'>{label}</div>
          : label
      }{help && <LabelHelp help={help} />}
    </label>
  );
}
