import BN from 'bn.js';

import { Balance } from '@polkadot/types/interfaces';
import { formatBalance } from '@polkadot/util';

/**
 * To format balance with preference options
 *
 * Examples (default):
 * "12" ==> "0.0012"
 * "123456789" ==> "12,345.6789"
 *
 * Examples (fixedPoint=2 and unit="Unit")
 * "123" ==> "1.23 Unit"
 */
const toFormattedBalance = (
  args: {
    value: BN | string | Balance;
    fixedPoint?: number;
    unit?: string;
  }
): string => {
  const DEFAULT_FIXED_POINT = 4;
  const DEFAULT_UNIT = '';
  const {
    value,
    fixedPoint = DEFAULT_FIXED_POINT,
    unit = DEFAULT_UNIT
  } = args;
  const unitPart = unit ? ` ${unit}` : '';

  // Make it a string so we know what we're dealing with
  let raw = value.toString();

  // values with a decimal point should be converted to their fixed width form.
  const balance: string = raw.indexOf('.') > 0 ?
    decimalToFixedWidth({ value: raw, fixedPoint }) : raw;

  /**
   * Condition 1: balance length is smaller than fixed point, e.g:
   * "123" ==> "0.1230" # when value length (3) is smaller than fixed point (4)
   */
  if (balance.toString().length < fixedPoint) {
    const valueAsBN = new BN(balance);
    const scalingSize = Math.pow(10, 1 - fixedPoint);
    const valuePart = (valueAsBN.toNumber() * scalingSize).toFixed(fixedPoint);

    return `${valuePart}${unitPart}`;
  }

  /**
   * Condition 2: balance length is larger than fixed point, e.g:
   * "123456789" ==> "12,345.6789" # when value length is larger than fixed point (4)
   */
  const polkadotFormatBalanceOptions = {
    decimals: fixedPoint,
    forceUnit: '-',
    withSi: false
  };

  // Adds thousands separators.
  // Note: we could use something simpler like `toLocaleString` but it cannot handle big number input.
  const formattedBalance = formatBalance(balance, polkadotFormatBalanceOptions);
  const integerPart = formattedBalance.split('.')[0];
  const decimalPart = balance.toString().substr(-fixedPoint);

  return `${integerPart}.${decimalPart}${unitPart}`;
};

// Convert a value with decimal points into it's fixed width equivalent
// e.g. '1234.567' => '1234567
const decimalToFixedWidth = (
  { value, fixedPoint }: { value: string, fixedPoint: number }
): string => {
  let [prefix, postfix = ''] = value.split('.');
  // ensure decimal part is == fixedPoint length
  postfix = postfix.length > fixedPoint ? postfix.substring(0, fixedPoint) : postfix.padEnd(fixedPoint, '0');
  // this will also remove leading 0s for fixed width representation
  return (+(prefix + postfix)).toString();
};

export default toFormattedBalance;
export { decimalToFixedWidth };
