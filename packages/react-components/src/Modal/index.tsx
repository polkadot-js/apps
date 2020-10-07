// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
  const { children, className = '', header, isOpen = true } = props;

  return (
    <SUIModal
      {...props}
      className={`theme--default ui--Modal ${className}`}
      header={undefined}
      open={isOpen}
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
