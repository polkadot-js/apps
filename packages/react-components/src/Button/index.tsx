// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ButtonType } from './types';

import './Button.css';

import IButton from './Button';
import Divider from './Divider';
import Group from './Group';
import Or from './Or';

const Button = IButton as unknown as ButtonType;

Button.Divider = Divider;
Button.Group = Group;
Button.Or = Or;

export default Button;
