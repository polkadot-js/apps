// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// IMPORTANT
//
// We only load the definitions here explicitly - if we try to go via
//   import { types } from '@subsocial/types';
// we end up with multiple version of types/API since it uses CJS,
// therefore here we explicitly import from the definitions (as re-exported)
import { types } from '@subsocial/definitions/interfaces/subsocial/definitions.js'; // KEEP, see above

export default { types };
