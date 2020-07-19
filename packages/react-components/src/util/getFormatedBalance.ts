import { formatBalance, formatDecimal } from '@polkadot/util';

// Get formatted balance function takes the 'big number' value and break
// the values in prefix and postfix .. The postfix is then displayed as (default = 4) 4 decimal place value
// if postfix is 432 -> 0432
export default function getFormattedBalance(value: any, supportsUnit?: boolean) {
  if (value) {
    const default_balance_param = formatBalance.getDefaults();
    const DECIMAL_PLACES = default_balance_param.decimals;
    const UNIT = default_balance_param.unit;
    const text = value.toString();
    const mid = text.length - DECIMAL_PLACES;
    const prefix = formatDecimal(text.substr(0, mid) || '0');
    const padding = mid < 0 ? 0 - mid : 0;
    const zeros = '0';
    const postfix = "".concat("".concat(new Array(padding + 1).join('0')).concat(text).substr(mid < 0 ? 0 : mid), zeros.repeat(DECIMAL_PLACES)).substr(0, DECIMAL_PLACES);
    return supportsUnit ? `${prefix}.${postfix} ${UNIT}` : `${prefix}.${postfix}`;
  } else {
    return '';
  }
}
