// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

export default function truncate (s: string, length = 24): string {
  return s.length > length
    ? `${s.substr(0, length / 2)}…${s.substr(s.length - length / 2)}`
    : s;
}
