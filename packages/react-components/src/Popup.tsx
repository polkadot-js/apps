// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Popup as PopupBase, StrictPopupProps } from 'semantic-ui-react';
import React from 'react';
import styled from 'styled-components';
import { colors } from '../../../styled-theming';

function Popup({ content, trigger, className, ...rest }: StrictPopupProps): React.ReactElement {
    return <PopupBase
      content={content}
      trigger={trigger}
      className={className}
      {...rest}
    />
}

export default styled(Popup)`
  max-width: none !important;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  background-color: ${colors.popUpBackground} !important;
  ::before {
    background-color: ${colors.popUpBackground} !important;
  }

  div {
    display: flex;
    color: ${colors.N0};
    > i {
      margin-right: 0;
      padding-right: 0;
      margin-left: 2px;
    }
  }
`;
