// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default function truncate (s: string, length = 24): string {
  return s.length > length
    ? `${s.substr(0, length / 2)}…${s.substr(s.length - length / 2)}`
    : s;
}
