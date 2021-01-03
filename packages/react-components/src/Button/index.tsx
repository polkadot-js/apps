// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ButtonType } from './types';

import IButton from './Button';
import Group from './Group';

const Button = IButton as unknown as ButtonType;

Button.Group = Group;

export default Button;
