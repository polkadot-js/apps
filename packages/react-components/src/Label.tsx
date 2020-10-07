// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from './types';

import React from 'react';

import LabelHelp from './LabelHelp';

interface Props extends BareProps {
  help?: React.ReactNode;
  label?: React.ReactNode;
  withEllipsis?: boolean;
}

function Label ({ className = '', help, label, withEllipsis }: Props): React.ReactElement<Props> {
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

export default React.memo(Label);
