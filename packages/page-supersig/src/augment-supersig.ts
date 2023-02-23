import '@polkadot/rpc-core/types/jsonrpc';

import type { AugmentedRpc } from '@polkadot/rpc-core/types';
import type { AccountId } from '@polkadot/types/interfaces/runtime';
import type { Observable } from '@polkadot/types/types';
import type  { MembersList, CallId, FetchProposalState, UserSupersig, FetchListProposals } from 'supersig-types/dist/interfaces/default'


export type __AugmentedRpc = AugmentedRpc<() => unknown>;

declare module '@polkadot/rpc-core/types/jsonrpc' {
  interface RpcInterface {
    superSig: {

        listMembers: AugmentedRpc<(supersig_id: AccountId | string | Uint8Array) => Observable<MembersList>>;

        getProposalState: AugmentedRpc<(supersig_id: AccountId | string | Uint8Array, call_id: CallId | string | Uint8Array) => Observable<FetchProposalState>>;

        getUserSupersigs: AugmentedRpc<(user_account: AccountId | string | Uint8Array) => Observable<UserSupersig>>;

        listProposals: AugmentedRpc<(supersig_id: AccountId | string | Uint8Array) => Observable<FetchListProposals>>;

    }

  }
}
