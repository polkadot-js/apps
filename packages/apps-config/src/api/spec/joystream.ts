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
        ActorId: 'u64',
        MemberId: 'u64',
        BlockAndTime: {
          block: 'u32',
          time: 'u64'
        },
        ThreadId: 'u64',
        PostId: 'u64',
        InputValidationLengthConstraint: {
          min: 'u16',
          max_min_diff: 'u16'
        },
        WorkingGroup: {
          _enum: [
            'Forum',
            'Storage',
            'Content',
            'OperationsAlpha',
            'Gateway',
            'Distribution',
            'OperationsBeta',
            'OperationsGamma',
            'Membership'
          ]
        },
        BalanceKind: {
          _enum: [
            'Positive',
            'Negative'
          ]
        },
        Address: 'AccountId',
        LookupSource: 'AccountId',
        ChannelId: 'u64',
        Url: 'Text',
        Membership: {
          handle_hash: 'Bytes',
          root_account: 'AccountId',
          controller_account: 'AccountId',
          verified: 'bool',
          invites: 'u32'
        },
        StakingAccountMemberBinding: {
          member_id: 'MemberId',
          confirmed: 'bool'
        },
        BuyMembershipParameters: {
          root_account: 'AccountId',
          controller_account: 'AccountId',
          handle: 'Option<Text>',
          metadata: 'Bytes',
          referrer_id: 'Option<MemberId>'
        },
        InviteMembershipParameters: {
          inviting_member_id: 'MemberId',
          root_account: 'AccountId',
          controller_account: 'AccountId',
          handle: 'Option<Text>',
          metadata: 'Bytes'
        },
        CouncilStageAnnouncing: {
          candidatesCount: 'u64'
        },
        CouncilStageElection: {
          candidatesCount: 'u64'
        },
        CouncilStageUpdate: {
          stage: 'CouncilStage',
          changed_at: 'u32'
        },
        CouncilStage: {
          _enum: {
            Announcing: 'CouncilStageAnnouncing',
            Election: 'CouncilStageElection',
            Idle: 'Null'
          }
        },
        Candidate: {
          staking_account_id: 'AccountId',
          reward_account_id: 'AccountId',
          cycle_id: 'u64',
          stake: 'u32',
          vote_power: 'VotePower',
          note_hash: 'Option<Hash>'
        },
        CouncilMemberOf: {
          staking_account_id: 'AccountId',
          reward_account_id: 'AccountId',
          membership_id: 'MemberId',
          stake: 'u128',
          last_payment_block: 'u32',
          unpaid_reward: 'u128'
        },
        CastVoteOf: {
          commitment: 'Hash',
          cycle_id: 'u64',
          stake: 'u128',
          vote_for: 'Option<MemberId>'
        },
        ForumUserId: 'u64',
        ModeratorId: 'u64',
        CategoryId: 'u64',
        PostReactionId: 'u64',
        Category: {
          title_hash: 'Hash',
          description_hash: 'Hash',
          archived: 'bool',
          num_direct_subcategories: 'u32',
          num_direct_threads: 'u32',
          num_direct_moderators: 'u32',
          parent_category_id: 'Option<CategoryId>',
          sticky_thread_ids: 'Vec<ThreadId>'
        },
        Thread: {
          category_id: 'CategoryId',
          author_id: 'ForumUserId',
          poll: 'Option<Poll>',
          cleanup_pay_off: 'u128',
          number_of_posts: 'u64'
        },
        Post: {
          thread_id: 'ThreadId',
          text_hash: 'Hash',
          author_id: 'ForumUserId',
          cleanup_pay_off: 'u128',
          last_edited: 'u32'
        },
        PollAlternative: {
          alternative_text_hash: 'Hash',
          vote_count: 'u32'
        },
        Poll: {
          description_hash: 'Hash',
          end_time: 'u64',
          poll_alternatives: 'Vec<PollAlternative>'
        },
        PrivilegedActor: {
          _enum: {
            Lead: 'Null',
            Moderator: 'ModeratorId'
          }
        },
        PollInput: {
          description: 'Bytes',
          end_time: 'u64',
          poll_alternatives: 'Vec<Bytes>'
        },
        ThreadOf: {
          category_id: 'CategoryId',
          author_id: 'ForumUserId',
          poll: 'Option<Poll>',
          cleanup_pay_off: 'u128',
          number_of_posts: 'u64'
        },
        ExtendedPostId: {
          category_id: 'CategoryId',
          thread_id: 'ThreadId',
          post_id: 'PostId'
        },
        ApplicationId: 'u64',
        Application: {
          role_account_id: 'AccountId',
          reward_account_id: 'AccountId',
          staking_account_id: 'AccountId',
          member_id: 'MemberId',
          description_hash: 'Bytes',
          opening_id: 'OpeningId'
        },
        ApplicationInfo: {
          application_id: 'ApplicationId',
          application: 'Application'
        },
        ApplicationIdSet: 'BTreeSet<ApplicationId>',
        ApplicationIdToWorkerIdMap: 'BTreeMap<ApplicationId,WorkerId>',
        WorkerId: 'u64',
        Worker: {
          member_id: 'MemberId',
          role_account_id: 'AccountId',
          staking_account_id: 'AccountId',
          reward_account_id: 'AccountId',
          started_leaving_at: 'Option<u32>',
          job_unstaking_period: 'u32',
          reward_per_block: 'Option<u128>',
          missed_reward: 'Option<u128>',
          created_at: 'u32'
        },
        WorkerInfo: {
          worker_id: 'WorkerId',
          worker: 'Worker'
        },
        Opening: {
          opening_type: 'OpeningType',
          created: 'u32',
          description_hash: 'Bytes',
          stake_policy: 'StakePolicy',
          reward_per_block: 'Option<u128>',
          creation_stake: 'u128'
        },
        OpeningId: 'u64',
        StakePolicy: {
          stake_amount: 'u128',
          leaving_unstaking_period: 'u32'
        },
        StakeParameters: {
          stake: 'u128',
          staking_account_id: 'AccountId'
        },
        StorageProviderId: 'u64',
        OpeningType: {
          _enum: {
            Leader: 'Null',
            Regular: 'Null'
          }
        },
        ApplyOnOpeningParameters: {
          member_id: 'MemberId',
          opening_id: 'OpeningId',
          role_account_id: 'AccountId',
          reward_account_id: 'AccountId',
          description: 'Bytes',
          stake_parameters: 'StakeParameters'
        },
        Penalty: {
          slashing_text: 'Text',
          slashing_amount: 'u128'
        },
        RewardPaymentType: {
          _enum: [
            'MissedReward',
            'RegularReward'
          ]
        },
        StorageBucketId: 'u64',
        StorageBucketsPerBagValueConstraint: {
          min: 'u64',
          max_min_diff: 'u64'
        },
        DataObjectId: 'u64',
        DynamicBagId: {
          _enum: {
            Member: 'MemberId',
            Channel: 'u64'
          }
        },
        Voucher: {
          sizeLimit: 'u64',
          objectsLimit: 'u64',
          sizeUsed: 'u64',
          objectsUsed: 'u64'
        },
        DynamicBagType: {
          _enum: [
            'Member',
            'Channel'
          ]
        },
        DynamicBagCreationPolicy: {
          numberOfStorageBuckets: 'u64',
          families: 'BTreeMap<DistributionBucketFamilyId,u32>'
        },
        DynamicBagDeletionPrize: {
          account_id: 'GenericAccountId',
          prize: 'u128'
        },
        DynamicBagDeletionPrizeRecord: {
          account_id: 'GenericAccountId',
          prize: 'u128'
        },
        Bag: {
          stored_by: 'BTreeSet<StorageBucketId>',
          distributed_by: 'BTreeSet<DistributionBucketId>',
          deletion_prize: 'Option<u128>',
          objects_total_size: 'u64',
          objects_number: 'u64'
        },
        StorageBucket: {
          operator_status: 'StorageBucketOperatorStatus',
          accepting_new_bags: 'bool',
          voucher: 'Voucher',
          assigned_bags: 'u64'
        },
        StaticBagId: {
          _enum: {
            Council: 'Null',
            WorkingGroup: 'WorkingGroup'
          }
        },
        Static: {
          _enum: {
            Council: 'Null',
            WorkingGroup: 'WorkingGroup'
          }
        },
        Dynamic: {
          _enum: {
            Member: 'MemberId',
            Channel: 'u64'
          }
        },
        BagId: {
          _enum: {
            Static: 'Static',
            Dynamic: 'Dynamic'
          }
        },
        DataObjectCreationParameters: {
          size: 'u64',
          ipfsContentId: 'Bytes'
        },
        BagIdType: {
          _enum: {
            Static: 'Static',
            Dynamic: 'Dynamic'
          }
        },
        UploadParameters: {
          bagId: 'BagId',
          objectCreationList: 'Vec<DataObjectCreationParameters>',
          deletionPrizeSourceAccountId: 'GenericAccountId',
          expectedDataSizeFee: 'u128'
        },
        StorageBucketIdSet: 'BTreeSet<StorageBucketId>',
        DataObjectIdSet: 'BTreeSet<DataObjectId>',
        ContentIdSet: 'BTreeSet<Cid>',
        Cid: 'Bytes',
        StorageBucketOperatorStatus: {
          _enum: {
            Missing: 'Null',
            InvitedStorageWorker: 'WorkerId',
            StorageWorker: '(WorkerId,GenericAccountId)'
          }
        },
        DataObject: {
          accepted: 'bool',
          deletion_prize: 'u128',
          size: 'u64',
          ipfsContentId: 'Bytes'
        },
        DistributionBucketId: {
          distribution_bucket_family_id: 'DistributionBucketFamilyId',
          distribution_bucket_index: 'DistributionBucketIndex'
        },
        DistributionBucketIndex: 'u64',
        DistributionBucketFamilyId: 'u64',
        DistributionBucket: {
          accepting_new_bags: 'bool',
          distributing: 'bool',
          pending_invitations: 'BTreeSet<WorkerId>',
          operators: 'BTreeSet<WorkerId>',
          assigned_bags: 'u64'
        },
        DistributionBucketFamily: {
          next_distribution_bucket_index: 'DistributionBucketIndex'
        },
        DataObjectIdMap: 'BTreeMap<DataObjectId,DataObject>',
        DistributionBucketIndexSet: 'BTreeSet<DistributionBucketIndex>',
        DynamicBagCreationPolicyDistributorFamiliesMap: 'BTreeMap<DistributionBucketFamilyId,u32>',
        ParticipantId: 'u64',
        Title: 'Text',
        UpdatedTitle: 'Option<Text>',
        UpdatedBody: 'Option<Text>',
        ReplyId: 'u64',
        Reply: {
          text_hash: 'Hash',
          owner: 'ParticipantId',
          parent_id: 'PostId'
        },
        ReplyToDelete: {
          post_id: 'PostId',
          reply_id: 'ReplyId',
          hide: 'bool'
        },
        ProposalId: 'u32',
        ProposalStatus: {
          _enum: {
            Active: 'Null',
            PendingExecution: 'u32',
            PendingConstitutionality: 'Null'
          }
        },
        ProposalOf: {
          parameters: 'ProposalParameters',
          proposerId: 'MemberId',
          activatedAt: 'u32',
          status: 'ProposalStatus',
          votingResults: 'VotingResults',
          exactExecutionBlock: 'Option<u32>',
          nrOfCouncilConfirmations: 'u32',
          stakingAccountId: 'Option<AccountId>'
        },
        ProposalDetails: {
          _enum: {
            Signal: 'Text',
            RuntimeUpgrade: 'Bytes',
            FundingRequest: 'Vec<FundingRequestParameters>',
            SetMaxValidatorCount: 'u32',
            CreateWorkingGroupLeadOpening: 'CreateOpeningParameters',
            FillWorkingGroupLeadOpening: 'FillOpeningParameters',
            UpdateWorkingGroupBudget: '(Balance,WorkingGroup,BalanceKind)',
            DecreaseWorkingGroupLeadStake: '(WorkerId,Balance,WorkingGroup)',
            SlashWorkingGroupLead: '(WorkerId,Balance,WorkingGroup)',
            SetWorkingGroupLeadReward: '(WorkerId,Option<Balance>,WorkingGroup)',
            TerminateWorkingGroupLead: 'TerminateRoleParameters',
            AmendConstitution: 'Text',
            CancelWorkingGroupLeadOpening: '(OpeningId,WorkingGroup)',
            SetMembershipPrice: 'u128',
            SetCouncilBudgetIncrement: 'u128',
            SetCouncilorReward: 'u128',
            SetInitialInvitationBalance: 'u128',
            SetInitialInvitationCount: 'u32',
            SetMembershipLeadInvitationQuota: 'u32',
            SetReferralCut: 'u8',
            CreateBlogPost: '(Text,Text)',
            EditBlogPost: '(PostId,Option<Text>,Option<Text>)',
            LockBlogPost: 'PostId',
            UnlockBlogPost: 'PostId',
            VetoProposal: 'ProposalId'
          }
        },
        ProposalDetailsOf: {
          _enum: {
            Signal: 'Text',
            RuntimeUpgrade: 'Bytes',
            FundingRequest: 'Vec<FundingRequestParameters>',
            SetMaxValidatorCount: 'u32',
            CreateWorkingGroupLeadOpening: 'CreateOpeningParameters',
            FillWorkingGroupLeadOpening: 'FillOpeningParameters',
            UpdateWorkingGroupBudget: '(Balance,WorkingGroup,BalanceKind)',
            DecreaseWorkingGroupLeadStake: '(WorkerId,Balance,WorkingGroup)',
            SlashWorkingGroupLead: '(WorkerId,Balance,WorkingGroup)',
            SetWorkingGroupLeadReward: '(WorkerId,Option<Balance>,WorkingGroup)',
            TerminateWorkingGroupLead: 'TerminateRoleParameters',
            AmendConstitution: 'Text',
            CancelWorkingGroupLeadOpening: '(OpeningId,WorkingGroup)',
            SetMembershipPrice: 'u128',
            SetCouncilBudgetIncrement: 'u128',
            SetCouncilorReward: 'u128',
            SetInitialInvitationBalance: 'u128',
            SetInitialInvitationCount: 'u32',
            SetMembershipLeadInvitationQuota: 'u32',
            SetReferralCut: 'u8',
            CreateBlogPost: '(Text,Text)',
            EditBlogPost: '(PostId,Option<Text>,Option<Text>)',
            LockBlogPost: 'PostId',
            UnlockBlogPost: 'PostId',
            VetoProposal: 'ProposalId'
          }
        },
        VotingResults: {
          abstensions: 'u32',
          approvals: 'u32',
          rejections: 'u32',
          slashes: 'u32'
        },
        ProposalParameters: {
          votingPeriod: 'u32',
          gracePeriod: 'u32',
          approvalQuorumPercentage: 'u32',
          approvalThresholdPercentage: 'u32',
          slashingQuorumPercentage: 'u32',
          slashingThresholdPercentage: 'u32',
          requiredStake: 'Option<u128>',
          constitutionality: 'u32'
        },
        GeneralProposalParameters: {
          member_id: 'MemberId',
          title: 'Text',
          description: 'Text',
          staking_account_id: 'Option<AccountId>',
          exact_execution_block: 'Option<u32>'
        },
        VoteKind: {
          _enum: [
            'Approve',
            'Reject',
            'Slash',
            'Abstain'
          ]
        },
        DiscussionThread: {
          activated_at: 'u32',
          author_id: 'u64',
          mode: 'ThreadMode'
        },
        DiscussionPost: {
          author_id: 'u64'
        },
        CreateOpeningParameters: {
          description: 'Bytes',
          stake_policy: 'StakePolicy',
          reward_per_block: 'Option<u128>',
          working_group: 'WorkingGroup'
        },
        FillOpeningParameters: {
          opening_id: 'OpeningId',
          successful_application_id: 'ApplicationId',
          working_group: 'WorkingGroup'
        },
        TerminateRoleParameters: {
          worker_id: 'WorkerId',
          slashing_amount: 'Option<u128>',
          working_group: 'WorkingGroup'
        },
        ProposalDecision: {
          _enum: {
            Canceled: 'Null',
            CanceledByRuntime: 'Null',
            Vetoed: 'Null',
            Rejected: 'Null',
            Slashed: 'Null',
            Expired: 'Null',
            Approved: 'Approved'
          }
        },
        ExecutionFailed: {
          error: 'Text'
        },
        Approved: {
          _enum: [
            'PendingExecution',
            'PendingConstitutionality'
          ]
        },
        SetLeadParams: '(MemberId,AccountId)',
        ThreadMode: {
          _enum: {
            Open: 'Null',
            Closed: 'Vec<MemberId>'
          }
        },
        ExecutionStatus: {
          _enum: {
            Executed: 'Null',
            ExecutionFailed: 'ExecutionFailed'
          }
        },
        FundingRequestParameters: {
          account: 'AccountId',
          amount: 'u128'
        },
        ReferendumStageVoting: {
          started: 'u32',
          winning_target_count: 'u64',
          current_cycle_id: 'u64'
        },
        ReferendumStageRevealing: {
          started: 'u32',
          winning_target_count: 'u64',
          intermediate_winners: 'Vec<OptionResult>',
          current_cycle_id: 'u64'
        },
        ReferendumStage: {
          _enum: {
            Inactive: 'Null',
            Voting: 'ReferendumStageVoting',
            Revealing: 'ReferendumStageRevealing'
          }
        },
        OptionResult: {
          option_id: 'MemberId',
          vote_power: 'VotePower'
        },
        VotePower: 'u128',
        ConstitutionInfo: {
          text_hash: 'Hash'
        },
        BountyId: 'u64',
        EntryId: 'u64',
        BountyActor: {
          _enum: {
            Council: 'Null',
            Member: 'MemberId'
          }
        },
        AssuranceContractType_Closed: 'BTreeSet<MemberId>',
        AssuranceContractType: {
          _enum: {
            Open: 'Null',
            Closed: 'AssuranceContractType_Closed'
          }
        },
        FundingType_Limited: {
          min_funding_amount: 'u128',
          max_funding_amount: 'u128',
          funding_period: 'u32'
        },
        FundingType_Perpetual: {
          target: 'u128'
        },
        FundingType: {
          _enum: {
            Perpetual: 'FundingType_Perpetual',
            Limited: 'FundingType_Limited'
          }
        },
        BountyCreationParameters: {
          oracle: 'BountyActor',
          contract_type: 'AssuranceContractType',
          creator: 'BountyActor',
          cherry: 'u128',
          entrant_stake: 'u128',
          funding_type: 'FundingType',
          work_period: 'u32',
          judging_period: 'u32'
        },
        OracleWorkEntryJudgment_Winner: {
          reward: 'u128'
        },
        OracleWorkEntryJudgment: {
          _enum: {
            Winner: 'OracleWorkEntryJudgment_Winner',
            Rejected: 'Null'
          }
        },
        OracleJudgment: 'BTreeMap<EntryId,OracleWorkEntryJudgment>',
        Entry: {
          member_id: 'MemberId',
          staking_account_id: 'AccountId',
          submitted_at: 'u32',
          work_submitted: 'bool',
          oracle_judgment_result: 'Option<OracleWorkEntryJudgment>'
        },
        BountyMilestone_Created: {
          created_at: 'u32',
          has_contributions: 'bool'
        },
        BountyMilestone_BountyMaxFundingReached: {
          max_funding_reached_at: 'u32'
        },
        BountyMilestone_WorkSubmitted: {
          work_period_started_at: 'u32'
        },
        BountyMilestone_JudgmentSubmitted: {
          successful_bounty: 'bool'
        },
        BountyMilestone: {
          _enum: {
            Created: 'BountyMilestone_Created',
            BountyMaxFundingReached: 'BountyMilestone_BountyMaxFundingReached',
            WorkSubmitted: 'BountyMilestone_WorkSubmitted',
            JudgmentSubmitted: 'BountyMilestone_JudgmentSubmitted'
          }
        },
        Bounty: {
          creation_params: 'BountyCreationParameters',
          total_funding: 'u128',
          milestone: 'BountyMilestone',
          active_work_entry_count: 'u32'
        },
        CuratorId: 'u64',
        CuratorGroupId: 'u64',
        CuratorGroup: {
          curators: 'BTreeSet<CuratorId>',
          active: 'bool'
        },
        ContentActor: {
          _enum: {
            Curator: '(CuratorGroupId,CuratorId)',
            Member: 'MemberId',
            Lead: 'Null'
          }
        },
        StorageAssets: {
          object_creation_list: 'Vec<DataObjectCreationParameters>',
          expected_data_size_fee: 'u128'
        },
        Channel: {
          owner: 'ChannelOwner',
          num_videos: 'u64',
          is_censored: 'bool',
          reward_account: 'Option<GenericAccountId>',
          collaborators: 'BTreeSet<MemberId>',
          moderators: 'BTreeSet<MemberId>',
          cumulative_payout_earned: 'u128'
        },
        ChannelOwner: {
          _enum: {
            Member: 'MemberId',
            Curators: 'CuratorGroupId'
          }
        },
        ChannelCategoryId: 'u64',
        ChannelCategory: {},
        ChannelCategoryCreationParameters: {
          meta: 'Bytes'
        },
        ChannelCategoryUpdateParameters: {
          new_meta: 'Bytes'
        },
        ChannelCreationParameters: {
          assets: 'Option<StorageAssets>',
          meta: 'Option<Bytes>',
          reward_account: 'Option<GenericAccountId>',
          collaborators: 'BTreeSet<MemberId>',
          moderators: 'BTreeSet<MemberId>'
        },
        ChannelUpdateParameters: {
          assets_to_upload: 'Option<StorageAssets>',
          new_meta: 'Option<Bytes>',
          reward_account: 'Option<Option<GenericAccountId>>',
          assets_to_remove: 'BTreeSet<DataObjectId>',
          collaborators: 'Option<BTreeSet<MemberId>>'
        },
        Video: {
          in_channel: 'ChannelId',
          is_censored: 'bool',
          enable_comments: 'bool',
          video_post_id: 'Option<VideoPostId>',
          nft_status: 'Option<OwnedNft>'
        },
        VideoId: 'u64',
        VideoCategoryId: 'u64',
        VideoCategory: {},
        VideoCategoryCreationParameters: {
          meta: 'Bytes'
        },
        VideoCategoryUpdateParameters: {
          new_meta: 'Bytes'
        },
        VideoCreationParameters: {
          assets: 'Option<StorageAssets>',
          meta: 'Option<Bytes>',
          enable_comments: 'bool',
          auto_issue_nft: 'Option<NftIssuanceParameters>'
        },
        VideoUpdateParameters: {
          assets_to_upload: 'Option<StorageAssets>',
          new_meta: 'Option<Bytes>',
          assets_to_remove: 'BTreeSet<DataObjectId>',
          enable_comments: 'Option<bool>',
          auto_issue_nft: 'Option<NftIssuanceParameters>'
        },
        MaxNumber: 'u32',
        IsCensored: 'bool',
        VideoPostId: 'u64',
        ReactionId: 'u64',
        VideoPostType: {
          _enum: {
            Description: 'Null',
            Comment: 'VideoPostId'
          }
        },
        VideoPost: {
          author: 'ContentActor',
          bloat_bond: 'u128',
          replies_count: 'VideoPostId',
          post_type: 'VideoPostType',
          video_reference: 'VideoId'
        },
        Side: {
          _enum: [
            'Left',
            'Right'
          ]
        },
        ProofElement: {
          hash: 'Hash',
          side: 'Side'
        },
        VideoPostCreationParameters: {
          post_type: 'VideoPostType',
          video_reference: 'VideoId'
        },
        VideoPostDeletionParameters: {
          witness: 'Option<Hash>',
          rationale: 'Option<Bytes>'
        },
        PullPayment: {
          channel_id: 'ChannelId',
          cumulative_payout_claimed: 'u128',
          reason: 'Hash'
        },
        ModeratorSet: 'BTreeSet<MemberId>',
        Royalty: 'Perbill',
        EnglishAuctionParams: {
          starting_price: 'u128',
          buy_now_price: 'Option<u128>',
          whitelist: 'BTreeSet<MemberId>',
          starts_at: 'Option<u32>',
          duration: 'u32',
          extension_period: 'u32',
          min_bid_step: 'u128'
        },
        OpenAuctionParams: {
          starting_price: 'u128',
          buy_now_price: 'Option<u128>',
          starts_at: 'Option<u32>',
          whitelist: 'BTreeSet<MemberId>',
          bid_lock_duration: 'u32'
        },
        EnglishAuction: {
          starting_price: 'u128',
          buy_now_price: 'Option<u128>',
          whitelist: 'BTreeSet<MemberId>',
          end: 'u32',
          start: 'u32',
          extension_period: 'u32',
          min_bid_step: 'u128',
          top_bid: 'Option<EnglishAuctionBid>'
        },
        OpenAuction: {
          starting_price: 'u128',
          buy_now_price: 'Option<u128>',
          whitelist: 'BTreeSet<MemberId>',
          bid_lock_duration: 'u32',
          auction_id: 'OpenAuctionId',
          start: 'u32'
        },
        OpenAuctionBid: {
          amount: 'u128',
          made_at_block: 'u32',
          auction_id: 'OpenAuctionId'
        },
        EnglishAuctionBid: {
          amount: 'u128',
          bidder_id: 'MemberId'
        },
        TransactionalStatus: {
          _enum: {
            Idle: 'Null',
            InitiatedOfferToMember: '(MemberId,Option<u128>)',
            EnglishAuction: 'EnglishAuction',
            OpenAuction: 'OpenAuction',
            BuyNow: 'u128'
          }
        },
        NftOwner: {
          _enum: {
            ChannelOwner: 'Null',
            Member: 'MemberId'
          }
        },
        OwnedNft: {
          owner: 'NftOwner',
          transactional_status: 'TransactionalStatus',
          creator_royalty: 'Option<Royalty>',
          open_auctions_nonce: 'OpenAuctionId'
        },
        CurrencyOf: 'u128',
        CurrencyAmount: 'u128',
        InitTransactionalStatus: {
          _enum: {
            Idle: 'Null',
            BuyNow: 'u128',
            InitiatedOfferToMember: '(MemberId,Option<u128>)',
            EnglishAuction: 'EnglishAuctionParams',
            OpenAuction: 'OpenAuctionParams'
          }
        },
        NftIssuanceParameters: {
          royalty: 'Option<Royalty>',
          nft_metadata: 'Bytes',
          non_channel_owner: 'Option<MemberId>',
          init_transactional_status: 'InitTransactionalStatus'
        },
        NftMetadata: 'Vec<u8>',
        OpenAuctionId: 'u64',
        AccountInfo: 'AccountInfoWithRefCount',
        ValidatorPrefs: 'ValidatorPrefsWithCommission'
      }
    }
  ]
};

export default definitions;
