// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        Address: 'MultiAddress',
        LookupSource: 'MultiAddress',
        CeremonyPhaseType: {
          _enum: [
            'Registering',
            'Assigning',
            'Attesting'
          ]
        },
        CeremonyIndexType: 'u32',
        ParticipantIndexType: 'u64',
        MeetupIndexType: 'u64',
        AttestationIndexType: 'u64',
        CurrencyIdentifier: 'Hash',
        BalanceType: 'i128',
        BalanceEntry: {
          principal: 'i128',
          last_update: 'BlockNumber'
        },
        CurrencyCeremony: {
          cid: 'CurrencyIdentifier',
          cindex: 'CeremonyIndexType'
        },
        Location: {
          lat: 'i64',
          lon: 'i64'
        },
        Reputation: {
          _enum: [
            'Unverified',
            'UnverifiedReputable',
            'VerifiedUnlinked',
            'VerifiedLinked'
          ]
        },
        CurrencyPropertiesType: {
          name_utf8: 'Text',
          demurrage_per_block: 'i128'
        },
        ClaimOfAttendance: {
          claimant_public: 'AccountId',
          ceremony_index: 'CeremonyIndexType',
          currency_identifier: 'CurrencyIdentifier',
          meetup_index: 'MeetupIndexType',
          location: 'Location',
          timestamp: 'Moment',
          number_of_participants_confirmed: 'u32'
        },
        Attestation: {
          claim: 'ClaimOfAttendance',
          signature: 'Signature',
          public: 'AccountId'
        },
        ProofOfAttendance: {
          prover_public: 'AccountId',
          ceremony_index: 'CeremonyIndexType',
          currency_identifier: 'CurrencyIdentifier',
          attendee_public: 'AccountId',
          attendee_signature: 'Signature'
        },
        ShopIdentifier: 'Text',
        ArticleIdentifier: 'Text'
      }
    }
  ]
};

export default definitions;
