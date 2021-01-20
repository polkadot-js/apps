// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

export default function classes (...classNames: (boolean | null | string | undefined)[]): string {
  return classNames
    .filter((className): boolean => !!className)
    .join(' ');
}
