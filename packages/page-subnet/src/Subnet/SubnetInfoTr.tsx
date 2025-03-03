import React from 'react';
import { AddressSmall, Table } from '@polkadot/react-components';
import { useTranslation } from '../translate.js';
import { formatBEVM } from '../Utils/formatBEVM.js';
import { useToggle } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  info: {
    hotkey: string;
    coldkey: string;
    stake: [string, string][];
    rank: number;
    emission: string;
    active: boolean;
    incentive: number;
    consensus: number;
    trust: number;
    validator_trust: number;
    validator_permit: boolean;
  };
}

function SubnetInfoTr({ className, info }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isExpanded, toggleIsExpanded] = useToggle(false);

  return (
    <React.Fragment>
      <tr className={`${className} isExpanded isFirst ${isExpanded ? 'packedBottom' : 'isLast'}`}>
        <td><AddressSmall value={info.hotkey} /></td>
        <td><AddressSmall value={info.coldkey} /></td>
        <td>{formatBEVM(info.stake.reduce((sum, [_, amount]) => sum + Number(amount), 0))}</td>
        <td>{info.rank}</td>
        <td>{formatBEVM(Number(info.emission))}</td>
        <td>{info.active ? t('Active') : t('Inactive')}</td>
        <Table.Column.Expand
          isExpanded={isExpanded}
          toggle={toggleIsExpanded}
        />
      </tr>
      {isExpanded && (
        <tr className={`${className} isExpanded details-row`}>
          <td colSpan={7}>
            <div style={{
              display: 'flex',
              gap: '10rem',
              padding: '1rem'
            }}>
              <div>
                <h5>{t('Incentive')}</h5>
                <div>{info.incentive}%</div>
              </div>
              <div>
                <h5>{t('Consensus')}</h5>
                <div>{info.consensus}%</div>
              </div>
              <div>
                <h5>{t('Trust')}</h5>
                <div>{info.trust}%</div>
              </div>
              <div>
                <h5>{t('Validator Trust')}</h5>
                <div>{info.validator_trust}%</div>
              </div>
              <div>
                <h5>{t('Validator Permit')}</h5>
                <div>{info.validator_permit ? t('Yes') : t('No')}</div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

export default React.memo(SubnetInfoTr);