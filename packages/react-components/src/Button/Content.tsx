// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
