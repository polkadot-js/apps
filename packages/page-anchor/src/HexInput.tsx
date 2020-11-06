import React, { useState, useEffect } from 'react';
import { hexToU8a } from '@polkadot/util';
import { hex } from './hrproof';

type Props = {
  defaultValue: Uint8Array,
  // called whenever the text is changed
  // if text is valid hex, it will be converted to bytes and passed to this function
  // if text is not valid hex, this function will be called with `null` as its argument
  onbytes: (_: Uint8Array | null) => void,
}

function HexInput({ defaultValue, onbytes }: Props): React.ReactElement {
  const [text, setText] = useState<string>(() => hex(defaultValue));
  const valid = validHex(text);

  useEffect(() => {
    onbytes(valid ? hexToU8a(text) : null);
  }, [text]);

  return <input type="text" value={text} onChange={a => {
    setText(a.target.value);
  }}></input>;
}

function validHex(str: string): boolean {
  if (str.length % 2 !== 0) {
    return false;
  }
  for (const char of str) {
    if (!"0123456789abcdefABCDEF".includes(char)) {
      return false;
    }
  }
  return true;
}

export default React.memo(HexInput);
