import React, {useMemo, useRef, useState} from 'react';
import styled from 'styled-components';
import {Button, Table, ToggleGroup} from '@polkadot/react-components';
// import {getNominationAndDividedExternal} from '@polkadot/react-hooks-chainx/useNomination';
import {useTranslation} from '../translate';
// import {Nomination, UserNominations, Dividended, UserInterest} from '@polkadot/react-hooks-chainx/types';

import UserTable from './usertable';
import {ValidatorInfo} from '../types';
import {useAllNominationData} from '../useAllNominationData'
import {ActionStatus} from '@polkadot/react-components/Status/types'

interface Props {
  validatorInfoList: ValidatorInfo[];
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}


function UserNomination({ onStatusChange, validatorInfoList, className = ''}: Props): React.ReactElement<Props> | null {
  const {t} = useTranslation();
  const { data: allNominationData, loading, refetch } = useAllNominationData()
  //let { allDividended, allNominations } = useNomination([currentAccount]);
  const [typeIndex, setTypeIndex] = useState(0);

  const stashTypes = useRef([
    { text: t('Nominators'), value: 'Nominators' },
    { text: t('Validators'), value: 'vals' },
  ]);
  // const [state, setState] = useState({
  //   allNominations: [],
  //   allDividended: []
  // });

  const headerRef = useRef<[React.ReactNode?, string?, number?][]>([
    [t('My accounts'), 'start'],
    [t('Validator'), 'start'],
    [t('Bonded'), 'start'],
    [t('Interest'), 'start'],
    [t('Freeze'), 'start'],
    [undefined, 'start']
  ]);

  const allNominations = allNominationData.map(i => i.ownNominations).flat()
  const allDividended = allNominationData.map(i => i.ownDividended).flat()

  const validNominations = useMemo(() => {
    const formattedAllNominations = allNominations.filter((nmn) => {
      const userInterestItem = allDividended.find(dvd => dvd.account === nmn.account);
      const interestNode = userInterestItem?.interests.find(i => i.validator === nmn.validatorId);
      const blInterestNode = Boolean(interestNode ? Number(interestNode?.interest) !== 0 : 0);
      const chunks: number = nmn?.unbondedChunks ? nmn.unbondedChunks.reduce((total, record) => {
        return total + Number(record.value);
      }, 0) : 0;
      const blNomination: boolean = Boolean(Number(nmn.nomination) !== 0);
      return blNomination || Boolean(chunks !== 0) || blInterestNode;
    })

    return typeIndex === 0 ? formattedAllNominations : formattedAllNominations.filter(i => validatorInfoList.find(j => j.account === i.account))
  }, [typeIndex, JSON.stringify(allNominations), JSON.stringify(validatorInfoList)])

  return (
    <div>
      <Button.Group>
        <ToggleGroup
          onChange={setTypeIndex}
          options={stashTypes.current}
          value={typeIndex}
        />
      </Button.Group>
      <div className={`container ${className}`}>
        <Table
          empty={!loading}
          header={headerRef.current}
        >
          {
            validNominations.map((item, index) => {
              const userInterest = allDividended.find(j => j.account === item.account);

              if (item.account) {
                return (
                  <UserTable
                    key={`${item.validatorId}-${item.account}`}
                    accountId={item.account}
                    nomination={validNominations[index]}
                    validatorInfoList={validatorInfoList}
                    userInterest={userInterest?.interests?.find(item => item.validator === validNominations[index].validatorId)?.interest}
                    onSuccess={refetch}
                    isNominatorList={typeIndex === 0}
                  />
                );
              } else {
                return null;
              }
            })
          }
        </Table>
      </div>
    </div>
  );
}


export default React.memo(styled(UserNomination)`
  &.container {
    overflow: auto;
  }
  &::-webkit-scrollbar {
    display: none;
  }
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
`);
