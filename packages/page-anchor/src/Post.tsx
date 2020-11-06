import { SubmittableExtrinsic } from '@polkadot/api/types';
import React, { useState } from 'react';
import { Button, InputAddress, TxButton } from '@polkadot/react-components';
import { BalanceFree } from '@polkadot/react-query';

type Props = {
  extrinsic: SubmittableExtrinsic<'promise'> | null,
}

function Deploy({ extrinsic }: Props): React.ReactElement {
  const [account, setAccount] = useState<string | null>(null);

  return (
    <div className='extrinsics--Selection'>
      <InputAddress
        label='using account'
        labelExtra={
          <BalanceFree
            label={<label>free balance</label>}
            params={account}
          />
        }
        onChange={setAccount}
        type='account'
      />
      <Button.Group>
        <TxButton
          accountId={account}
          extrinsic={extrinsic}
          icon='sign-in-alt'
          isDisabled={!extrinsic || !account}
          label={'Submit Transaction'}
        />
      </Button.Group>
    </div>
  );
}

export default React.memo(Deploy);
