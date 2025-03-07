const { ApiPromise, WsProvider, Keyring } = require("@polkadot/api");
require("dotenv").config();

const WS_PROVIDER = process.env.WS_PROVIDER;
const SEED_OR_PRIVATE_KEY = process.env.SEED_OR_PRIVATE_KEY;
const VALIDATORS = [
    "an7LvWFafWHjyhZ267mkuuy6XV4ssZZjeA1dux8ofdwAPyeho",
    "an7fhdR6zS8BMRW6EMb1bCHJCrQyzcHGNoQ9aVTzsunrs6CjT",
    "an9hU3qw1XvcQmT37LpksFQewQcc1ik59LRRkPXmaLKPkWXss",
    "an9qKiw6BF76nD5ctS7dzn8rSwLJ7QX2F4gVM2EAF5RA1cshs",
    "an9xepmpRQpem2oQDTTuVqtBm6ct5kpitQCkYdurYJvbnNEnB",
    "anAEa5Ef4qG8aGPscxPyy8xhwWqPuhdezg7mP3vXEon9ujyLK",
    "anAS24QYWe4dNb3kSzZWooWyTwZ886wwkWGQjEqb4E3edRGFx",
    "anAZH2qZWUKrATyesBNafnAB5uZxWJKikh79hvdMa37Jstg5o",
    "anAnfgSbH2ZTUDjbusaXDyzssoEbHPQUL5RWB4Jy57aQirDwS",
    "anAnkRFYEmXPi8ZzwGWSx5UYkwkwEqKuSHDUwN6r1Ytw4mNoF",
];

async function main() {
  const provider = new WsProvider(WS_PROVIDER);
  const api = await ApiPromise.create({ provider });

  const keyring = new Keyring({ type: "sr25519" });
  const sender = keyring.addFromUri(SEED_OR_PRIVATE_KEY);

  // Fetch initial nonce
  let nonce = await api.rpc.system.accountNextIndex(sender.address);

  // Fetch rewards for all validators
  api.derive.staking.stakerRewardsMulti(VALIDATORS, false, async (rewards) => {
    let transactions = [];

    rewards.forEach((eras, index) => {
      const validator = VALIDATORS[index];

      eras.forEach((info) => {
        if (!info.isClaimed) {
          transactions.push(api.tx.staking.payoutStakers(validator, info.era));
        }
      });
    });

    console.log(`Total transactions to submit: ${transactions.length}`);

    // Submit transactions in batches of 10
    const BATCH_SIZE = 10;
    for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
      const batch = transactions.slice(i, i + BATCH_SIZE);
      const batchTx = api.tx.utility.batchAll(batch);

      try {
        console.log(`Submitting batch ${i / BATCH_SIZE + 1} with nonce ${nonce}`);
        await new Promise((resolve, reject) => {
          batchTx.signAndSend(sender, { nonce }, ({ status }) => {
            if (status.isInBlock) {
              console.log(`✅ Batch ${i / BATCH_SIZE + 1} included in block ${status.asInBlock}`);
            } else if (status.isFinalized) {
              console.log(`🎉 Batch ${i / BATCH_SIZE + 1} finalized`);
              resolve();
            }
          }).catch(reject);
        });

        // Increment nonce for next batch
        nonce++;

        // Delay to avoid spamming
        await new Promise((res) => setTimeout(res, 500));
      } catch (error) {
        console.error(`❌ Error submitting batch ${i / BATCH_SIZE + 1}:`, error);
      }
    }

    console.log("All transactions submitted!");
  });
}

main().catch(console.error);
