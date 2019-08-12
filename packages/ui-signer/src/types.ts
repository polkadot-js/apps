// Copyright 2017-2019 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export interface Signed {
  data: Uint8Array;
  message: Uint8Array;
  signature: Uint8Array;
}
