// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

export class TokenUnit {
  public static abbr = 'Unit';

  public static setAbbr (abbr: string = TokenUnit.abbr): void {
    TokenUnit.abbr = abbr;
  }
}
