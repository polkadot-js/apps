// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label/Label';
import styled from 'styled-components';

import Tooltip from './Tooltip';

interface Props {
  className?: string;
  color?: 'green' | 'grey' | 'red';
  hover?: React.ReactNode;
  isTag?: boolean;
  label: React.ReactNode;
  size?: 'small' | 'tiny';
}

let tagId = 0;

function Tag ({ className, color, hover, isTag = true, label, size = 'small' }: Props): React.ReactElement<Props> {
  const [trigger] = useState(`tag-hover-${Date.now()}-${tagId++}`);
  const tooltipProps = hover
    ? { 'data-for': trigger, 'data-tip': true }
    : {};

  return (
    <Label
      className={className}
      color={color || 'grey'}
      size={size}
      tag={isTag}
      {...tooltipProps}
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
