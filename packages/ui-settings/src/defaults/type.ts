// Copyright 2017-2019 @plasm/ui-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// matches https://polkadot.js.org & https://*.polkadot.io
export const isPolkadot = typeof window !== 'undefined' && window.location.host.includes('polkadot');
export const isPlasm = typeof window !== 'undefined' && window.location.host.includes('plasm');