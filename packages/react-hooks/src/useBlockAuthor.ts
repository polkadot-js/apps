import { AccountId32 } from "@polkadot/types/interfaces";
import type { HeaderExtended } from '@polkadot/api-derive/types';

import { useApi } from "./useApi.js";
import { useEffect, useState } from "react";
import { U32 } from "@polkadot/types-codec";

type AuxData = [AccountId32[], U32];

export function useBlockAuthor(header: HeaderExtended) {
    const [author, setAuthor] = useState<AccountId32 | undefined>(undefined);
    let { api } = useApi();

    let slot = header.digest.logs.map((log) => {
        if (log.isPreRuntime) {
            const [_, data] = log.asPreRuntime;
            return api.createType("U64", data.toU8a());
        }
    }).filter(Boolean)

    useEffect(() => {
        extractAuthor().then((a) => setAuthor(a))
    }, [])

    const extractAuthor = async (): Promise<AccountId32> => { 
        let [authorities, session_length]: AuxData = await api.call.spinApi.auxData();
        let session_idx = Math.floor(slot?.[0] as any / session_length.toNumber());
        let author_idx = session_idx % authorities.length;
    

        return authorities[author_idx];
    }

    return author
}