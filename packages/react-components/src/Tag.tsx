// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import { Label } from 'semantic-ui-react';
import styled from 'styled-components';

import Tooltip from './Tooltip';

interface Props {
  className?: string;
  color?: 'green' | 'grey' | 'red';
  hover?: React.ReactNode;
  label: React.ReactNode;
}

let tagId = 0;

function Tag ({ className, color, hover, label }: Props): React.ReactElement<Props> {
  const [trigger] = useState(`tag-hover-${Date.now()}-${tagId++}`);

  return (
    <Label
      className={className}
      color={color || 'grey'}
      data-for={trigger}
      data-tip={true}
      size='small'
      tag
    >
      {label}
      {hover && (
        <Tooltip
          text={hover}
          trigger={trigger}
        />
      )}
    </Label>
  );
}

export default React.memo(styled(Tag)`
  white-space: nowrap;
`);
