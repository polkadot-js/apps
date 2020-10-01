import React, { useState, useEffect } from 'react';
import { useApi } from '@polkadot/react-hooks';
import DIDs from '../DIDs';

import { u8aToHex, u8aToString } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';

function MasterMembersList (): React.ReactElement<Props> {
  const { api } = useApi();
  const [ accounts, setAccounts ] = useState([]);

  async function loadMasters() {
    const members = await api.query.master.members();
    const membersList = Array.from(members.members);
    const masterDIDs = membersList.map(item => {
      const didStr = `did:dock:${encodeAddress(u8aToHex(item))}`;
      return {
        identity: didStr,
      };
    });
    setAccounts(masterDIDs);
  }

  useEffect(() => {
    if (!accounts.length) {
      loadMasters();
    }
  }, [accounts]);

  return (
    <DIDs headers={accounts} title="master members" />
  );
}

export default React.memo(MasterMembersList);
