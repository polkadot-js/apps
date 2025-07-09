// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // Metadata v14 was introduced here. Hence, we don't need type overrides anymore.
      minmax: [9, undefined],
      types: {
        // Types for the signed extensions still need to be declared.
        CommunityIdentifier: {
          geohash: 'GeoHash',
          digest: 'CidDigest'
        },
        GeoHash: '[u8; 5]',
        // We need to call it `CidDigest` because plain `Digest` is already a substrate type.
        CidDigest: '[u8; 4]'
      }
    },
    {
      // until v14
      minmax: [0, 8],
      types: {
        ShardIdentifier: 'Hash',
        GetterArgs: '(AccountId, CommunityIdentifier)',
        Enclave: {
          pubkey: 'AccountId',
          mrenclave: 'Hash',
          timestamp: 'u64',
          url: 'Text'
        },
        PublicGetter: {
          _enum: {
            total_issuance: 'CommunityIdentifier',
            participant_count: 'CommunityIdentifier',
            meetup_count: 'CommunityIdentifier',
            ceremony_reward: 'CommunityIdentifier',
            location_tolerance: 'CommunityIdentifier',
            time_tolerance: 'CommunityIdentifier',
            scheduler_state: 'CommunityIdentifier'
          }
        },
        TrustedGetter: {
          _enum: {
            balance: '(AccountId, CommunityIdentifier)',
            participant_index: '(AccountId, CommunityIdentifier)',
            meetup_index: '(AccountId, CommunityIdentifier)',
            attestations: '(AccountId, CommunityIdentifier)',
            meetup_registry: '(AccountId, CommunityIdentifier)'
          }
        },
        TrustedGetterSigned: {
          getter: 'TrustedGetter',
          signature: 'Signature'
        },
        Getter: {
          _enum: {
            public: 'PublicGetter',
            trusted: 'TrustedGetterSigned'
          }
        },
        ClientRequest: {
          _enum: {
            PubKeyWorker: null,
            MuRaPortWorker: null,
            StfState: '(Getter, ShardIdentifier)'
          }
        },
        WorkerEncoded: 'Vec<u8>',
        Request: {
          shard: 'ShardIdentifier',
          cyphertext: 'WorkerEncoded'
        },
        TrustedCallSigned: {
          call: 'TrustedCall',
          nonce: 'u32',
          signature: 'Signature'
        },
        TrustedCall: {
          _enum: {
            balance_transfer: 'BalanceTransferArgs',
            ceremonies_register_participant: 'RegisterParticipantArgs',
            ceremonies_register_attestations: 'RegisterAttestationsArgs',
            ceremonies_grant_reputation: 'GrantReputationArgs'
          }
        },
        BalanceTransferArgs: '(AccountId, AccountId, CommunityIdentifier, BalanceType)',
        RegisterParticipantArgs: '(AccountId, CommunityIdentifier, Option<ProofOfAttendance<MultiSignature, AccountId>>)',
        RegisterAttestationsArgs: '(AccountId, Vec<Attestation<MultiSignature, AccountId, u64>>)',
        GrantReputationArgs: '(AccountId, CommunityIdentifier, AccountId)',
        BalanceType: 'i128',
        BalanceEntry: {
          principal: 'BalanceType',
          lastUpdate: 'BlockNumber'
        },
        Demurrage: 'BalanceType',

        BusinessIdentifier: {
          communityIdentifier: 'CommunityIdentifier',
          controller: 'AccountId'
        },
        OfferingIdentifier: 'u32',
        BusinessData: {
          url: 'PalletString',
          last_oid: 'u32'
        },
        OfferingData: {
          url: 'PalletString'
        },
        PalletString: 'Text',
        IpfsCid: 'Text',
        FixedI64F64: {
          bits: 'i128'
        },
        CeremonyIndexType: 'u32',
        CeremonyPhaseType: {
          _enum: ['Registering', 'Assigning', 'Attesting']
        },
        ParticipantIndexType: 'u64',
        MeetupIndexType: 'u64',
        AttestationIndexType: 'u64',
        MeetupAssignment: '(MeetupIndexType, Option<Location>)',
        MeetupTimeOffsetType: 'i32',
        Reputation: {
          _enum: ['Unverified', 'UnverifiedReputable', 'VerifiedUnlinked', 'VerifiedLinked']
        },
        CommunityReputation: {
          communityIdentifier: 'CommunityIdentifier',
          reputation: 'Reputation'
        },
        ClaimOfAttendance: {
          claimantPublic: 'AccountId',
          ceremonyIndex: 'CeremonyIndexType',
          communityIdentifier: 'CommunityIdentifier',
          meetupIndex: 'MeetupIndexType',
          location: 'Location',
          timestamp: 'Moment',
          numberOfParticipantsConfirmed: 'u32',
          claimantSignature: 'Option<MultiSignature>'
        },
        ClaimOfAttendanceSigningPayload: {
          claimantPublic: 'AccountId',
          ceremonyIndex: 'CeremonyIndexType',
          communityIdentifier: 'CommunityIdentifier',
          meetupIndex: 'MeetupIndexType',
          location: 'Location',
          timestamp: 'Moment',
          numberOfParticipantsConfirmed: 'u32'
        },
        AssignmentCount: {
          bootstrappers: 'ParticipantIndexType',
          reputables: 'ParticipantIndexType',
          endorsees: 'ParticipantIndexType',
          newbies: 'ParticipantIndexType'
        },
        Assignment: {
          bootstrappersReputables: 'AssignmentParams',
          endorsees: 'AssignmentParams',
          newbies: 'AssignmentParams',
          locations: 'AssignmentParams'
        },
        AssignmentParams: {
          m: 'u64',
          s1: 'u64',
          s2: 'u64'
        },
        CommunityCeremonyStats: {
          communityCeremony: '(CommunityIdentifier, CeremonyIndexType)',
          assignment: 'Assignment',
          assignmentCount: 'AssignmentCount',
          meetupCount: 'MeetupIndexType',
          meetups: 'Vec<Meetup>'
        },
        Meetup: {
          index: 'MeetupIndexType',
          location: 'LocationRpc',
          time: 'Moment',
          registrations: 'Vec<(AccountId, ParticipantRegistration)>'
        },
        ParticipantRegistration: {
          index: 'ParticipantIndexType',
          registrationType: 'RegistrationType'
        },
        RegistrationType: {
          _enum: ['Bootstrapper', 'Reputable', 'Endorsee', 'Newbie']
        },
        // Todo: remove this type does no longer exist in ceremonies, but it still exists in the trusted stuff.
        Attestation: {
          claim: 'ClaimOfAttendance',
          signature: 'MultiSignature',
          public: 'AccountId'
        },
        ProofOfAttendance: {
          proverPublic: 'AccountId',
          ceremonyIndex: 'CeremonyIndexType',
          communityIdentifier: 'CommunityIdentifier',
          attendeePublic: 'AccountId',
          attendeeSignature: 'MultiSignature'
        },
        CommunityIdentifier: {
          geohash: 'GeoHash',
          digest: 'CidDigest'
        },
        GeoHash: '[u8; 5]',
        // We need to call it `CidDigest` because plain `Digest` is already a substrate type.
        CidDigest: '[u8; 4]',
        CommunityCeremony: '(CommunityIdentifier,CeremonyIndexType)',
        NominalIncomeType: 'BalanceType',
        // This is used when handling fixed-point numbers that have been serialized with `serialize_fixed` on rusts end,
        // which is the case when we call any rpc-getters.
        DegreeRpc: 'Text',
        // This is used when we need to encode fixed-point numbers with scale-codec, e.g., when using it in an extrinsic.
        DegreeFixed: 'i128',
        Location: {
          lat: 'DegreeFixed',
          lon: 'DegreeFixed'
        },
        LocationRpc: {
          lat: 'DegreeRpc',
          lon: 'DegreeRpc'
        },
        CidName: {
          cid: 'CommunityIdentifier',
          name: 'Text'
        },
        CommunityMetadataType: {
          name: 'Text',
          symbol: 'Text',
          assets: 'Text',
          theme: 'Option<Text>',
          url: 'Option<Text>'
        },
        SystemNumber: 'u32',
        SchedulerState: '(CeremonyIndexType, CeremonyPhaseType, SystemNumber)'
      }
    }
  ],
  signedExtensions: {
    ChargeAssetTxPayment: {
      extrinsic: {
        tip: 'Compact<Balance>',
        assetId: 'Option<CommunityIdentifier>'
      },
      payload: {}
    }
  }
};

export default definitions;
