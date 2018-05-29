// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import withApiDiv from './with/apiDiv';

export default withApiDiv({ name: 'isConnected' })(
  (value?: boolean = false): string => {
    return value
      ? 'connected'
      : 'disconnected';
  },
  { className: 'rx--Connected' }
);
