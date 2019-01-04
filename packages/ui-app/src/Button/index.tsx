// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ButtonType } from './types';

import './Button.css';

import Button from './Button';
import Divider from './Divider';
import Group from './Group';
import Or from './Or';

(Button as ButtonType).Divider = Divider;
(Button as ButtonType).Group = Group;
(Button as ButtonType).Or = Or;

export default (Button as ButtonType);
