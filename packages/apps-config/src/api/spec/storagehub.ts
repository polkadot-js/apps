// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// import type { OverrideBundleDefinition } from '@polkadot/types/types';
// import { OverrideBundleDefinition } from '@polkadot/types/types';
import { storageHubDefinitions } from '@storagehub/types-bundle';

// // structs need to be in order
// /* eslint-disable sort-keys */
// const definitions: OverrideBundleDefinition = {
//     runtime:{
//         ProofsDealerApi: [
//             {
//                 methods: {
//                     get_last_tick_provider_submitted_proof: {
//                         description: "Get the last tick for which the submitter submitted a proof.",
//                         params: [
//                             {
//                                 name: "providerId",
//                                 type: "ProviderId"
//                             }
//                         ],
//                         type: "Result<BlockNumber, GetLastTickProviderSubmittedProofError>"
//                     },
//                     get_last_checkpoint_challenge_tick: {
//                         description: "Get the last checkpoint challenge tick.",
//                         params: [],
//                         type: "BlockNumber"
//                     },
//                     get_checkpoint_challenges: {
//                         description: "Get checkpoint challenges for a given block.",
//                         params: [
//                             {
//                                 name: "tick",
//                                 type: "BlockNumber"
//                             }
//                         ],
//                         type: "Result<Vec<(Key, Option<TrieRemoveMutation>)>, GetCheckpointChallengesError>"
//                     },
//                     get_challenge_period: {
//                         description: "Get the challenge period for a given Provider.",
//                         params: [
//                             {
//                                 name: "providerId",
//                                 type: "ProviderId"
//                             }
//                         ],
//                         type: "Result<BlockNumber, GetChallengePeriodError>"
//                     },
//                     get_checkpoint_challenge_period: {
//                         description: "Get the checkpoint challenge period.",
//                         params: [],
//                         type: "BlockNumber"
//                     },
//                     get_challenges_from_seed: {
//                         description: "Get challenges from a seed.",
//                         params: [
//                             {
//                                 name: "seed",
//                                 type: "RandomnessOutput"
//                             },
//                             {
//                                 name: "providerId",
//                                 type: "ProviderId"
//                             },
//                             {
//                                 name: "count",
//                                 type: "u32"
//                             }
//                         ],
//                         type: "Vec<Key>"
//                     },
//                     get_forest_challenges_from_seed: {
//                         description: "Get forest challenges from a seed.",
//                         params: [
//                             {
//                                 name: "seed",
//                                 type: "RandomnessOutput"
//                             },
//                             {
//                                 name: "providerId",
//                                 type: "ProviderId"
//                             }
//                         ],
//                         type: "Vec<Key>"
//                     },
//                     get_current_tick: {
//                         description: "Get the current tick.",
//                         params: [],
//                         type: "BlockNumber"
//                     },
//                     get_next_deadline_tick: {
//                         description: "Get the next deadline tick.",
//                         params: [
//                             {
//                                 name: "providerId",
//                                 type: "ProviderId"
//                             }
//                         ],
//                         type: "Result<BlockNumber, GetNextDeadlineTickError>"
//                     }
//                 },
//                 version: 1
//             }
//         ],
//     }
//     rpc: {
//         storagehubclient: {
//           loadFileInStorage: {
//             description:
//               "Load a file in the local storage. This is the first step when uploading a file.",
//             params: [
//               {
//                 name: "file_path",
//                 type: "String"
//               },
//               {
//                 name: "location",
//                 type: "String"
//               },
//               {
//                 name: "owner",
//                 type: "AccountId32"
//               },
//               {
//                 name: "bucket_id",
//                 type: "H256"
//               }
//             ],
//             type: "FileMetadata"
//           },
//           saveFileToDisk: {
//             description: "Save a file from the local storage to the disk.",
//             params: [
//               {
//                 name: "file_key",
//                 type: "H256"
//               },
//               {
//                 name: "file_path",
//                 type: "String"
//               }
//             ],
//             type: "SaveFileToDisk"
//           },
//           getForestRoot: {
//             description: "Get the root of the forest trie.",
//             params: [],
//             type: "H256"
//           },
//           rotateBcsvKeys: {
//             description: "Rotate (generate and insert) new keys of BCSV type for the Blockchain Service.",
//             params: [
//               {
//                 name: "seed",
//                 type: "String"
//               }
//             ],
//             type: "String"
//           }
//         }
//       },
//   types: [
//     {
//       // on all versions
//       minmax: [0, undefined],
//       types: {
//         FileMetadata: {
//           owner: "Vec<u8>",
//           bucket_id: "Vec<u8>",
//           location: "Vec<u8>",
//           file_size: "u64",
//           fingerprint: "[u8; 32]"
//         },
//         IncompleteFileStatus: {
//           file_metadata: "FileMetadata",
//           stored_chunks: "u64",
//           total_chunks: "u64"
//         },
//         SaveFileToDisk: {
//           _enum: {
//             FileNotFound: null,
//             Success: "FileMetadata",
//             IncompleteFile: "IncompleteFileStatus"
//           }
//         },
//         ProviderId: "H256",
//         Key: "H256",
//         RandomnessOutput: "H256",
//         TrieRemoveMutation: {},
//         BackupStorageProviderId: "H256",
//         StorageData: "u32",
//         MerklePatriciaRoot: "H256",
//         ChunkId: "u64",
//         BackupStorageProvider: {
//           capacity: "StorageData",
//           data_used: "StorageData",
//           multiaddresses: "BoundedVec<u8, 5>",
//           root: "MerklePatriciaRoot",
//           last_capacity_change: "BlockNumber",
//           owner_account: "AccountId",
//           payment_account: "AccountId"
//         },
//         GetLastTickProviderSubmittedProofError: {
//           _enum: {
//             ProviderNotRegistered: null,
//             ProviderNeverSubmittedProof: null,
//             InternalApiError: null
//           }
//         },
//         GetCheckpointChallengesError: {
//           _enum: {
//             TickGreaterThanLastCheckpointTick: null,
//             NoCheckpointChallengesInTick: null,
//             InternalApiError: null
//           }
//         },
//         GetChallengePeriodError: {
//           _enum: {
//             ProviderNotRegistered: null
//           }
//         },
//         GetBspInfoError: {
//           _enum: {
//             BspNotRegistered: null,
//             InternalApiError: null
//           }
//         },
//         GetNextDeadlineTickError: {
//           _enum: {
//             ProviderNotRegistered: null,
//             ProviderNotInitialised: null,
//             ArithmeticOverflow: null,
//             InternalApiError: null
//           }
//         },
//         QueryFileEarliestVolunteerBlockError: {
//           _enum: {
//             FailedToEncodeFingerprint: null,
//             FailedToEncodeBsp: null,
//             ThresholdArithmeticError: null,
//             StorageRequestNotFound: null,
//             InternalError: null
//           }
//         },
//         QueryBspConfirmChunksToProveForFileError: {
//           _enum: {
//             StorageRequestNotFound: null,
//             InternalError: null
//           }
//         }
//       }
//     }
//   ]
// };

export default storageHubDefinitions;
