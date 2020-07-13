// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CustomDefinition } from '../types';

import Arcadia from './arcadia';
import Berlin from './berlin';

const definitions: Record<string, CustomDefinition> = {
  'Arcadia Nodle Network': Arcadia,
  Berlin
};

export default definitions;
