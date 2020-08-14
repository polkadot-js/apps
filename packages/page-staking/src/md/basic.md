# Staking

Welcome to the staking module. Here you can see an overview of all the validators on the network and participate in the network either a validator (running a node that helps secure the network), or as a nominator (adding funds to help secure the network).

Validators and nominators earn rewards at the end of each era. The rewards are split between the validators and its nominators, in proportion to the amount bonded.

# Bonding

Bonding funds is the first step to validate or nominate. It locks up a portion of funds that is used to secure the network. These funds are placed at risk, i.e. you can be slashed and lose a portion if the validator node misbehaves. Validators and nominators share both rewards and the slashing effects. Choosing a well behaving validator to nominate is crucial.

For bonding (with an intention to either validate or nominate), you need to have 2 accounts -

- **Stash** This is the primary account that holds the funds and has a portion bonded for participation;
- **Controller** This is used to control the operation of the validator or nominator, switching between validating, nominating and idle; (It only needs enough funds to send transactions when actions are taken)

To bond, you select the stash account, bond from it and designate a controller. Additionally you can select the amount of funds to bond and set your payout preferences.

# Nominating

Nomination (using the controller account as set as part of the bonding) is a process of selecting a number of validators (or potential validators) that you deem trustworthy. Once the validators are selected, the bonded value is assigned to participate in the network security.

You can stop nominating at any point in time, using the controller account. You can also bond more funds using the stash account.

# Validating

Validators run nodes that author blocks. The primary requirement here is the ability to run a node that is available 24/7 and is well-connected to the network.

In addition to the stash and controller account described above, a validator has to indicate an additional account called `Session key` -

- **Session** The seed of this account should be passed to the node using the `--key` parameter. The session account does not need to have funds as it does not need to send any transaction. The best practice is to create a dedicated account to be used as session account. Although a single account can theoretically be used as both session and controller, it is not recommended to do so. Having a dedicated session account would prevent the theft of funds should the validator node be compromised and the `--key` leaked.

As with the nomination operations, you can stop validation at any time using the controller. (Be it for maintenance, upgrades, or any other reason)
