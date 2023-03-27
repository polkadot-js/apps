// Copyright 2017-2023 @polkadot/app-utilities authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from 'react';

import { createOption } from '@polkadot/app-settings/util';
import { createSs58 } from '@polkadot/apps-config';
import { allNetworks } from '@polkadot/networks';
import { Dropdown, InputAddressSimple, Static } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';
import { base58Decode, checkAddressChecksum, encodeAddress, isAddress } from '@polkadot/util-crypto';

import { useTranslation } from './translate.js';

interface Props {
  className?: string;
}

interface State {
  address: string | null;
  inputSS58: number;
}

function getState (input: string | null): State {
  let address: string | null = null;
  let inputSS58 = 42;

  if (input && isAddress(input)) {
    const decoded = base58Decode(input);
    const [,,, ss58Decoded] = checkAddressChecksum(decoded);

    address = input;
    inputSS58 = ss58Decoded;
  }

  return {
    address,
    inputSS58
  };
}

function Addresses ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { chainSS58 } = useApi();
  const [{ address, inputSS58 }, setState] = useState<State>({ address: null, inputSS58: 42 });
  const [prefix, setPrefix] = useState(-1);

  const setAddress = useCallback(
    (address: string | null) =>
      setState(getState(address)),
    []
  );

  const prefixOptions = useMemo(
    () => {
      const network = allNetworks.find(({ prefix }) => prefix === chainSS58);

      return createSs58(t).map((o) =>
        createOption(o, ['default'], 'empty', (
          o.value === -1
            ? network
              ? ` (${network.displayName}, ${chainSS58 || 0})`
              : ` (${chainSS58 || 0})`
            : ` (${o.value})`
        ))
      );
    },
    [chainSS58, t]
  );

  const converted = useMemo(
    () => address && encodeAddress(address, prefix === -1 ? chainSS58 : prefix),
    [address, chainSS58, prefix]
  );

  return (
    <div className={className}>
      <div className='ui--row'>
        <InputAddressSimple
          autoFocus
          isError={!address}
          label={t<string>('address to convert')}
          noConvert
          onChange={setAddress}
        />
      </div>
      <div className='ui--row'>
        <Dropdown
          defaultValue={prefix}
          label={t<string>('address prefix')}
          onChange={setPrefix}
          options={prefixOptions}
        />
      </div>
      {address && (
        <>
          <div className='ui--row'>
            <Static
              className='medium'
              label={t<string>('input ss58 prefix')}
              value={formatNumber(inputSS58)}
            />
          </div>
          {converted && (
            <div className='ui--row'>
              <InputAddressSimple
                defaultValue={converted}
                isDisabled
                key={converted}
                label={t<string>('converted address')}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default React.memo(Addresses);
