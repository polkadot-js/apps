// AccountSelector.tsx
import React, { useCallback } from 'react';
import { useAccounts, useApi } from '@polkadot/react-hooks';
import { Dropdown } from '@polkadot/react-components';

interface Props {
  className?: string;
  onChange?: (address: string) => void;
  selectedAddress?: string;
}

function AccountSelector ({ className, onChange, selectedAddress }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();

  // 将账户地址转换为下拉菜单选项格式
  const accountOptions = allAccounts.map((address) => ({
    key: address,
    text: address,
    value: address
  }));

  const _onChange = useCallback(
    (address: string) => {
      onChange && onChange(address);
    },
    [onChange]
  );

  return (
    <div className={className}>
      <Dropdown
        help={hasAccounts
          ? 'Select an account from your available accounts'
          : 'No accounts available'}
        isDisabled={!hasAccounts}
        label='Account'
        onChange={_onChange}
        options={accountOptions}
        value={selectedAddress || (hasAccounts ? allAccounts[0] : '')}
      />
    </div>
  );
}

export default React.memo(AccountSelector);
