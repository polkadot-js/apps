// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

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

function Tag ({ className = '', color, hover, isTag = true, label, size = 'small' }: Props): React.ReactElement<Props> {
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
