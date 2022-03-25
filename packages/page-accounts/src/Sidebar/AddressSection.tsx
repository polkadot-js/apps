// Copyright 2017-2022 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

//import React from 'react';
import React, { useState } from 'react';

import { Button } from '@polkadot/react-components';

import { AccountName, IdentityIcon, Input } from '@polkadot/react-components';
import { AddressFlags } from '@polkadot/react-hooks/types';

import { useTranslation } from '../translate';
import {CopyToClipboard} from 'react-copy-to-clipboard';


interface Props {
  value: string,
  editingName: boolean,
  defaultValue: string,
  onChange: (value: string) => void,
  flags: AddressFlags,
  accountIndex: string | undefined,
}



function AddressSection ({ accountIndex, defaultValue, editingName, flags, onChange, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  // Declare a new state variable, which we'll call "count"
  const [countCopied, setCountCopied] = useState(0);


  
  return (


    
    <div className='ui--AddressSection'>
      <IdentityIcon
        size={80}
        value={value}
      />
      <div className='ui--AddressSection__AddressColumn'>
        <AccountName
          override={
            editingName
              ? (
                <Input
                  className='name--input'
                  defaultValue={defaultValue}
                  label='name-input'
                  onChange={onChange}
                  withLabel={false}
                />
              )
              : flags.isEditable
                ? (defaultValue.toUpperCase() || t<string>('<unknown>'))
                : undefined
          }
          value={value}
          withSidebar={false}
        />
       
        <div className='ui--AddressMenu-addr'>
          {value}
        </div>
        
        {accountIndex && (
          <div className='ui--AddressMenu-index'>
            <label>{t<string>('index')}:</label> {accountIndex}
          </div>
        )}
      </div>

      <div className='ui--AddressSection__CopyColumn'>
        <div className='ui--AddressMenu-copyaddr'>         
          <CopyToClipboard text={value}
          onCopy={() => setCountCopied(countCopied + 1)}
          >
            <span >
              <Button.Group> 
                <Button  
                    icon={countCopied ? 'check' : 'copy'}   
                    label={t<string>('Copy')} 
                    onClick={() => setCountCopied(countCopied + 1) }
                    onMouseLeave={() => setCountCopied(0) } 
                  /> 
              </Button.Group>
            </span>
          </CopyToClipboard>
        </div>
      </div>
    </div>
  );
}

export default React.memo(AddressSection);
