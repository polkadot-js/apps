// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';

import { ContentProps as Props } from './types';

export default function ButtonContent ({ children, hidden, visible }: Props): React.ReactElement<Props> {
  return (
    <SUIButton.Content
      hidden={hidden}
      visible={visible}
    >
      {children}
    </SUIButton.Content>
  );
}
