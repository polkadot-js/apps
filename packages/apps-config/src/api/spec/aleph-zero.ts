// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Structs and enum variants need to be in order
/* eslint-disable sort-keys */

export default {
  rpc: {
    alephNode: {
      emergencyFinalize: {
        description: 'Finalize the block with given hash and number using attached signature. Returns the empty string or an error.',
        params: [
          {
            name: 'justification',
            type: 'Bytes'
          },
          {
            name: 'hash',
            type: 'BlockHash'
          },
          {
            name: 'number',
            type: 'BlockNumber'
          }
        ],
        type: 'Null'
      },
      getBlockAuthor: {
        description: 'Get the author of the block with given hash.',
        params: [
          {
            name: 'hash',
            type: 'BlockHash'
          }
        ],
        type: 'Option<AccountId>'
      }
    }
  },
  runtime: {
    AlephSessionApi: [
      {
        methods: {
          authorities: {
            description: '',
            params: [],
            type: 'Vec<AuthorityId>'
          },
          authority_data: {
            description: '',
            params: [],
            type: 'SessionAuthorityData'
          },
          finality_version: {
            description: '',
            params: [],
            type: 'Version'
          },
          millisecs_per_block: {
            description: '',
            params: [],
            type: 'u64'
          },
          next_session_authorities: {
            description: '',
            params: [],
            type: 'Result<Vec<AuthorityId>, ApiError>'
          },
          next_session_authority_data: {
            description: '',
            params: [],
            type: 'Result<SessionAuthorityData, ApiError>'
          },
          next_session_finality_version: {
            description: '',
            params: [],
            type: 'Version'
          },
          predict_session_committee: {
            description: '',
            params: [
              {
                name: 'session',
                type: 'SessionIndex'
              }
            ],
            type: 'Result<SessionCommittee, SessionValidatorError>'
          },
          session_period: {
            description: '',
            params: [],
            type: 'u32'
          }
        },
        version: 1
      }
    ]
  },
  types: [
    {
      // supported on all versions
      minmax: [0, undefined],
      types: {
        ApiError: {
          _enum: ['DecodeKey']
        },
        SessionAuthorityData: {
          authorities: 'Vec<AuthorityId>',
          emergency_finalizer: 'Option<AuthorityId>'
        },
        SessionCommittee: {
          finality_committee: 'Vec<AccountId>',
          block_producers: 'Vec<AccountId>'
        },
        SessionNotWithinRangeError: {
          lower_limit: 'SessionIndex',
          upper_limit: 'SessionIndex'
        },
        SessionValidatorError: {
          _enum: {
            SessionNotWithinRange: 'SessionNotWithinRangeError',
            Other: 'Vec<u8>'
          }
        },
        Version: 'u32'
      }
    }
  ]
};
