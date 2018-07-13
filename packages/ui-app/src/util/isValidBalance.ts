// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

// RegEx Pattern: http://regexlib.com/REDetails.aspx?regexp_id=330
const re = RegExp('^[0-9 ]+[0-9 ]*$');

export default function isValidBalance (input: string): boolean {
  return input.trim().length !== 0 && re.test(input.trim());
}
