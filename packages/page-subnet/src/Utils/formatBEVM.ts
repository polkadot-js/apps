export const formatBEVM = (amount: number): string => {
    const value = amount/Math.pow(10,8);
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value).concat(' GEB');
  };

export const formatAddress = (address: string): string => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };


  // ASCII转换函数
export const asciiToString = (ascii: number[]): string => {
    return ascii ? ascii.map(code => String.fromCharCode(code)).join('') : '';
  };
