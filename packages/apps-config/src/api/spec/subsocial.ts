// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// We only load the definitions here explicitly - if we try to go via
//   import { types } from '@subsocial/types/substrate';
// we end up with multiple version of types/API
import definitions from '@subsocial/types/substrate/interfaces/subsocial/definitions';

export default definitions;
