// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ButtonType } from './types';

import IButton from './Button';
import Group from './Group';

const Button = IButton as unknown as ButtonType;

Button.Group = Group;

export default Button;
