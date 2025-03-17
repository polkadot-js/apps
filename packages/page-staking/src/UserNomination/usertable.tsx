
import React, { useMemo } from 'react';
import { Button } from '@polkadot/react-components';
import { AddressSmall } from '@polkadot/react-components';
import Vote from './vote';
import {useToggle} from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import Reback from './reback';
import UnBound from './unbond';
import ReBond from './rebond'

import Claim from './claim';
import { useTranslation } from '../translate';
import { ValidatorInfo } from '../types';
import {Nomination} from '../useAllNominationData'
import useMemberInfo from '@polkadot/app-alliance/src/useMemberInfo.js'
import {useRemainingVotes} from '../useRemainingVotes.js'

interface Props {
  accountId?: string;
  nomination?: Nomination;
  userInterest?: string;
  onSuccess: () => Promise<void>;
  validatorInfoList: ValidatorInfo[];
  isNominatorList: boolean;
}



function UserTable({ accountId, nomination, userInterest, onSuccess, validatorInfoList, isNominatorList }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
//   const [rebonds, setReBonds] = useState(true);
//   const [hoursafter, sethoursafter] = useState<BN>();
  const [isVoteOpen, toggleVote] = useToggle();
  const [isRebackOpen, toggleReback] = useToggle();
  const [isBoundOpen, toggleUnbound] = useToggle();
  const [isReBoundOpen, toggleRebound] = useToggle();

  const [isClaim, toggleClaim] = useToggle();

  const chunks = nomination?.unbondedChunks ? nomination.unbondedChunks.reduce((total, record) => {
    return total + Number(record.value);
  }, 0) : 0;

  const redeemOptions: object[] = [];

  nomination?.unbondedChunks ? nomination?.unbondedChunks.map((item, index) => {
    redeemOptions.push({
      validatorId: nomination.validatorId,
      text: 'locked until:' + item.lockedUntil,
      value: index + ''
    });
  }) : {};

  const validatorInfo = useMemo(() => {
    return validatorInfoList.find(i => i.account?.toLowerCase() === nomination?.validatorId.toLowerCase())
  }, [validatorInfoList, nomination])

  const { data: remainingVotesData, refetch: refetchRemainingVotesData } = useRemainingVotes(validatorInfo)

  return (
    <tr>
      <td>
        <AddressSmall
          key={nomination?.account}
          value={nomination?.account}
        />
      </td>
      <td>
        <AddressSmall
          key={nomination?.validatorId}
          value={nomination?.validatorId}
        />
      </td>
      <td>
        <FormatBalance value={nomination?.nomination} />
      </td>
      <td>
        <FormatBalance
          value={(isNominatorList ? userInterest?.[0] : userInterest?.[1]) ?? '0'}
          // format={isNominatorList ? [10, 'SATS']: undefined} />
          format={[10, 'SATS']}
        />
      </td>
      <td>
        <FormatBalance value={chunks > 0 ? chunks : '0'} />
      </td>

      <td className='button' key="claim">
        {
          isClaim && (
            <Claim
              account={accountId}
              onClose={toggleClaim}

              value={nomination?.validatorId}
              onSuccess={onSuccess}
            />
          )
        }
        {isVoteOpen && (
          <Vote
            account={accountId}
            key="vote"
            onClose={toggleVote}
            value={nomination?.validatorId}
            onSuccess={onSuccess}
            remainingVotesData={remainingVotesData}
          />
        )}

        {
          isRebackOpen && (
            <Reback
              account={accountId}
              onClose={toggleReback}

              redeemOptions={redeemOptions}
              key="reback"
              onSuccess={onSuccess}
              value={nomination?.validatorId}
            />
          )
        }
        {
          isBoundOpen && (
            <UnBound
              account={accountId}
              onClose={toggleUnbound}
              onSuccess={onSuccess}
              key="unbond"
              unamount={nomination?.nomination}
              value={nomination?.validatorId}
            />
          )
        }

        {
          isReBoundOpen && (
            <ReBond
              account={accountId}
              onClose={toggleRebound}
              validatorInfoList={validatorInfoList}
              value={nomination?.validatorId}
              onSuccess={() => {
                onSuccess?.()
                refetchRemainingVotesData()
              }}
              // rebond={rebonds}
              unamount={nomination?.nomination}
              // hoursafter={hoursafter}
            />
          )
        }

        <Button
          icon='paper-plane'
          label={t('Vote')}
          onClick={toggleVote}
        />
        <Button
          icon='paper-plane'
          label={t('Claim Interest')}
          onClick={toggleClaim}
        />
        <Button
          icon='paper-plane'
          label={t('Unbond')}
          onClick={toggleUnbound}
        />
        <Button
          icon='paper-plane'
          label={t('Rebond')}
          onClick={toggleRebound}
        />
        {
          Number(chunks) > 0 ? (
            <Button
              icon='paper-plane'
              label={t('Unfreeze')}
              onClick={toggleReback}
            />
          ) : null
        }
      </td>
    </tr >

  )


};


export default React.memo(UserTable);
