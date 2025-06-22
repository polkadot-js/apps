# @polkadot/app-staking-async

With Asset Hub migration, the workflow of the staking system will change. The "user interactions" (nominate, bond, etc) are by and large the same, yet some details outlined below will change:

On the relay chain, the session pallet will rotate session (aka. epochs) at a fixed rate as it did before. It will send these to AH in the form of a SessionReport message. Possibly, it will also send messages about offences to AH so that they can be applied and actually slash staker balances in AH.

`pallet-session` on the relay chain will only interact with `pallet-staking-async-ah-client`. `ah-client` could at any point, if it has one, return a validator set to session to be used for the next session.

In any session change in pallet-session where a new validator set is activated, that SessionReport will contain two pieces of information:

More Info can be found here - https://hackmd.io/7PiBrGxxRG2ib-WRZYJZhQ