// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as subsocialDefinitions from '@subsocial/types/substrate/interfaces/definitions';

import { typesFromDefs } from '../util';
console.log(subsocialDefinitions)
const subsocialTypes = typesFromDefs(subsocialDefinitions);
console.log('Subsocial Types', subsocialTypes)
export default subsocialTypes;
