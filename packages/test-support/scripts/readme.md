## Scripts for bounty testing

The scripts are prepared to run on a local, development version of substrate with following changes:
- `bin/node/runtime/src/lib.rs`
  ```
  pub const SpendPeriod: BlockNumber = 1 * MINUTES;
  pub const BountyDepositPayoutDelay: BlockNumber = 1 * MINUTES
  ```

To run a script enter the `packages/test-support` directory and run:
```
ts-node scripts/<script-name>
```

Available scripts:
- `createBounties` - creates a list of bounties,
  one in each status ( Proposed, Funded, Curator Proposed, Active, Pending Payout, Closed	)

