import React from "react";
import {Icon} from "@polkadot/react-components/index";
import AccountName from "@polkadot/react-components/AccountName";
import styled from "styled-components";

interface ParentAccountProps {
  address: string,
  className?: string
}

function ParentAccount ({ address, className }: ParentAccountProps): React.ReactElement<ParentAccountProps> {
  return (
    <div className={className}
         data-testid='parent'>
      <Icon className='parent-icon'
            icon='code-branch'/>
      <div className='parent-account-name'>
        <AccountName
          value={address}
          withSidebar
        >
        </AccountName>
      </div>
    </div>
  );
}

export default React.memo(styled(ParentAccount)`
    display: flex;
    flex-direction: row;
    font-size: 0.75rem;
    align-items: flex-end;
    color: #8B8B8B;

  & .parent-account-name {
    font-size: 0.8rem;
  }

  & .parent-icon {
    margin-right: 0.3rem;
  }
`);
