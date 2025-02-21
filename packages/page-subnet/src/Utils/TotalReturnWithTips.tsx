import Icon from '@polkadot/react-components/Icon';
import Tooltip from '@polkadot/react-components/Tooltip';
import React from 'react';

interface Props {
  key: string;
  value: string;
}

function TotalReturnWithTips({ key, value }: Props): React.ReactElement<Props> {
  return (


<div style={{display:'flex', flexDirection: 'row', alignItems:'center', gap:'8px'}}>
  <span>{value}</span>
  <>
    <Icon
      icon='info-circle'
      tooltip={`${key}-locks-trigger`}
    />
    <Tooltip trigger={`${key}-locks-trigger`}>
      <span>For every hour, 24 minutes will display as 0, which is determined by the chain. If you need to calculate your own profits, you can observe the changes in the amount of your personal staked tokens, and the rewards will automatically become part of your stake.</span>
    </Tooltip>
  </>
</div>

  )
}

export default TotalReturnWithTips; 