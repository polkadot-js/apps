// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonType } from './types';

import IButton from './Button';
import Content from './Content';
import Group from './Group';

const Button = IButton as unknown as ButtonType;

Button.Content = Content;
Button.Group = Group;

export default Button;
