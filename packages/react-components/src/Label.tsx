// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
