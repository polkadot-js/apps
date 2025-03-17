// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, {useMemo, useState } from 'react';
import {InputAddress, InputBalance, Modal, TxButton} from '@polkadot/react-components';
import { useTranslation } from '../translate';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { FormatBalance } from '@polkadot/react-query';
import { TxCallback } from '@polkadot/react-components/Status/types';
import { ValidatorInfo } from '../types';
import styled from 'styled-components';
import {useApi} from '@polkadot/react-hooks'
import {useRemainingVotes} from '../useRemainingVotes.js'

interface Props {
  account?: string;
  options?: KeyringSectionOption[];
  value?: string | null | undefined;
  onClose: () => void;
  onSuccess?: TxCallback;
  validatorInfoList: ValidatorInfo[];
//   rebond: boolean;
//   hoursafter: BN | undefined;
  unamount?:  string | null | undefined;
}

const Wrapper = styled(Modal)`
  .content {
    div:nth-child(3) {
      .msg {
        .msgError {
          color: red;
          margin-top: 10px;
          p {
            display: inline-block;
          }
          div {
            display: inline-block;
          }
        }
      }
    }
  }
`;

function ReBond({ account, onClose, options, value, onSuccess, validatorInfoList, unamount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi()

  const [validatorTo, setValidatorTo] = useState<string | null | undefined>();
  const [amount, setAmount] = useState<BN | undefined>();
  const validatorOptionsArray: KeyringSectionOption[] = [];

  validatorInfoList.forEach((item: any) => {
    const cur = item as ValidatorInfo;
    validatorOptionsArray.push({
      key: cur.account,
      value: cur.account,
      name: cur.account
    })
  });


  const transferrable = <div>
    <span className='label web3ComingChat' style={{
      marginRight: "8px"
    }}>{t<string>('Switchable Amount')}</span>
    <FormatBalance value={unamount}></FormatBalance>
  </div> ;

  const targetValidatorInfo = useMemo(() => {
    return validatorInfoList.find(i => i.account?.toLowerCase() === validatorTo?.toLowerCase())
  }, [validatorTo])

  const { data: remainingVotesData } = useRemainingVotes(targetValidatorInfo)

  return (
    <Wrapper
      header={t('Rebond')}
      size='large'
      onClose={onClose}
    >
      <Modal.Content>
        <Modal.Columns>
          <InputAddress
            defaultValue={account}
            // help='The actual account you wish to register account'
            isDisabled={!!account}
            label={t('My Account')}
            labelExtra={transferrable}
            type='account'
          />
          {/* <Modal.Column>
            <p>{t<string>('Rebond')}</p>
          </Modal.Column> */}
        </Modal.Columns>

        <Modal.Columns>
          <InputAddress
            defaultValue={value}
            isDisabled={!!value}
            value={value}
            // help={t<string>('From Validator')}
            hideAddress={true}
            label={t('From Validator')}
            labelExtra={
              <span> </span>
            }
            // onChange={setValidatorFrom}
            // options={
            //   validatorOptions
            // }
            type='allPlus'
          />
          {/* <Modal.Column>
            <p>{t<string>('From Validator')}</p>
          </Modal.Column> */}
        </Modal.Columns>

        <Modal.Columns>
          <InputAddress
            // help={t<string>('To Validator')}
            hideAddress={true}
            label={t('To Validator')}
            labelExtra={value?.toLowerCase() !== account?.toLowerCase() && (
              <span className="label">
                {t('Remaining Votes')}
                {'： '}
                {remainingVotesData && Number(remainingVotesData) > 0 ? <span> {remainingVotesData}</span> :
                  <span style={{color: 'red'}}>0</span>}
                {'  GEB'}
              </span>
            )}
            onChange={setValidatorTo}
            options={
              validatorOptionsArray
            }
            value={(validatorInfoList && validatorInfoList?.length) > 0 ? validatorInfoList[0]?.account : ''}
            defaultValue={(validatorInfoList && validatorInfoList?.length) > 0 ? validatorInfoList[0]?.account : ''}
            type='allPlus'
          />
      {/* <Modal.Column className="msg">
            <p>{t<string>('To Validator')}</p>
            <div className="msgError" style={{display: (rebond === true) ? "block" : "none"}}>
              <p>{t<string>('Switch interval less than 3 days, please in')}</p>
              <BlockToTime blocks={hoursafter} />
              <p>{t<string>('Retry after')}</p>
            </div>
          </Modal.Column> */}
        </Modal.Columns>

        <Modal.Columns>
          <InputBalance
            autoFocus
            // help={t<string>('Rebond Amount')}
            label={t('Rebond Amount')}
            onChange={setAmount}
          />
        </Modal.Columns>
      </Modal.Content>

      <Modal.Actions>
        <TxButton
         // isDisabled={rebond}
          accountId={account}
          icon='sign-in-alt'
          label={t('Rebond')}
          onStart={onClose}
          params={[value, validatorTo, amount]}
          onSuccess={onSuccess}
          tx={api.tx.xStaking.rebond}
        />
      </Modal.Actions>
    </Wrapper>
  );
}

export default React.memo(ReBond);
