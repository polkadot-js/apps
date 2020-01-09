// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import SUIModal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';

import { classes } from './util';

interface Props extends BareProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  [index: string]: any;
}

function Modal (props: Props): React.ReactElement<Props> {
  const { className, children, header } = props;

  return (
    <SUIModal
      {...props}
      className={classes('theme--default', 'ui--Modal', className)}
      dimmer='inverted'
      header={undefined}
    >
      {header && (
        <SUIModal.Header>{header}</SUIModal.Header>
      )}
      {children}
    </SUIModal>
  );
}

Modal.Actions = SUIModal.Actions;
Modal.Content = SUIModal.Content;
Modal.Header = SUIModal.Header;
Modal.Description = SUIModal.Description;

export default Modal;
