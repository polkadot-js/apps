// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeDef } from '@polkadot/react-components/types';
import type { ActionsProps, ColumnsProps, ModalProps } from './types';

import React, { useContext } from 'react';
import { Modal as SUIModal } from 'semantic-ui-react';
import { ThemeContext } from 'styled-components';

import Actions from './Actions';
import Columns from './Columns';

type ModalType = React.FC<ModalProps> & {
  Actions: React.FC<ActionsProps>;
  Columns: React.FC<ColumnsProps>;
  Content: typeof SUIModal.Content;
  Description: typeof SUIModal.Description;
};

function ModalBase (props: ModalProps): React.ReactElement<ModalProps> {
  const { theme } = useContext<ThemeDef>(ThemeContext);
  const { children, className = '', header, open = true } = props;

  return (
    <SUIModal
      {...props}
      className={`theme--${theme} ui--Modal ${className}`}
      header={undefined}
      open={open}
    >
      {header && (
        <div className='header'>
          <h1>{header}</h1>
        </div>
      )}
      {children}
    </SUIModal>
  );
}

const Modal = React.memo(ModalBase) as unknown as ModalType;

Modal.Actions = Actions;
Modal.Columns = Columns;
Modal.Content = SUIModal.Content;
Modal.Description = SUIModal.Description;

export default Modal;
