// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import LabelHelp from './LabelHelp';

interface Props {
  className?: string;
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
