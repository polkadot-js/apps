import BN from 'bn.js';
import React from 'react';
import { InputBalance, Bubble } from '@polkadot/ui-app/index';
import { formatBalance } from '@polkadot/util';

type Props = {
  label?: string,
  min?: BN,
  isValid?: boolean,
  onChange: (stake?: BN) => void
};

export default class Component extends React.PureComponent<Props> {
  render () {
    const { min, label, isValid, onChange } = this.props;
    return (
      <div className='ui--row'>
        <InputBalance
          className='medium'
          label={label || 'Amount to be staked:'}
          onChange={onChange}
        />
        {min && !min.isZero() && <div className='medium' style={{ marginLeft: '.5rem' }}>
          <Bubble
            className={`left pointing ${isValid ? 'ok' : 'warn'}`}
            icon={isValid ? 'check' : 'warning sign'}
            label='Minimum stake'
          >
            {formatBalance(min)}
          </Bubble>
        </div>}
      </div>
    );
  }
}
