// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ModalType } from './types';

import Actions from './Actions';
import ModalBase from './Base';
import Columns from './Columns';
import Content from './Content';

const Modal = ModalBase as unknown as ModalType;

Modal.Actions = Actions;
Modal.Columns = Columns;
Modal.Content = Content;

export default Modal;
