// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionsProps, ColumnProps, ModalProps } from './types';

import React from 'react';
import SUIModal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';

import Actions from './Actions';
import Column from './Column';
import Columns from './Columns';

type ModalType = React.FC<ModalProps> & {
  Actions: React.FC<ActionsProps>;
  Column: React.FC<ColumnProps>;
  Columns: React.FC<ColumnProps>;
  Content: typeof SUIModal.Content;
  Header: typeof SUIModal.Header;
  Description: typeof SUIModal.Description;
};

function ModalBase (props: ModalProps): React.ReactElement<ModalProps> {
  const { children, className = '', header, open = true } = props;

  return (
    <SUIModal
      {...props}
      className={`theme--default ui--Modal ${className}`}
      header={undefined}
      open={open}
    >
      {header && (
        <SUIModal.Header>{header}</SUIModal.Header>
      )}
      {children}
    </SUIModal>
  );
}

const Modal = React.memo(ModalBase) as unknown as ModalType;

Modal.Actions = Actions;
Modal.Column = Column;
Modal.Columns = Columns;
Modal.Content = SUIModal.Content;
Modal.Header = SUIModal.Header;
Modal.Description = SUIModal.Description;

export default Modal;

// rgba(0, 0, 0, 0.5);
// @media only screen and (min-width: 1200px)
// .ui.large.modal {
//     width: 1080px;
//     margin: 0;
// }

// @media only screen and (min-width: 992px)
// .ui.large.modal {
//     width: 1020px;
//     margin: 0;
// }
// @media only screen and (min-width: 768px)
// .ui.large.modal {
//     width: 88%;
//     margin: 0;
// }
