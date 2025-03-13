import Icon from '@polkadot/react-components/Icon';
import Tooltip from '@polkadot/react-components/Tooltip';
import React from 'react';
import { useTranslation } from '../translate.js';

interface Props {
  value: React.ReactNode;
}

function TotalReturnWithTips({ value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  return (
    <div style={{display:'flex', flexDirection: 'row', alignItems:'center', gap:'8px'}}>
      <span>{value}</span>
      <>
        <Icon
          icon='info-circle'
          tooltip={`locks-trigger`}
        />
        <Tooltip trigger={`locks-trigger`}>
          <span>{t('The data provided is 24-hour estimated values and may have discrepancies from actual earnings. Your realized profits will be directly added to your staked amount. The stake can be released at any time without a lock-up period.')}</span>
        </Tooltip>
      </>
    </div>
  )
}

export default TotalReturnWithTips;
