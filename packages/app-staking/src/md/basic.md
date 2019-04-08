# Staking

Welcome to the staking module. Here you can see an overview of all the validators on the network and participate in the network as either as validator (running a node that helps secure the network), or a nominator (adding funds to help secure the network).

Validators and nominators earn rewards at the end of an era: the rewards are split between the validators and nominators for that validator, in proportion to the amount bonded by each individual.

# Bonding

Bonding funds is the first step that either a validator or nominator performs. It locks up a portion of funds that is used to secure the network. These funds are placed at risk, i.e. you can be slashed and lose a portion if the validator node misbehaves. Validators and nominators share both rewards and the slashing effects. Choosing a well behaving validator to nominate is crucial.

For bonding (with an intention to either validate or nominate), you need to have 2 accounts -

- **Stash** This is the primary account that holds the funds and has a portion bonded for participation;
- **Controller** This is used to control the operation of the validator or nominator, switching between validating, nominating and idle; (It only needs enough funds to send transactions when actions are taken)

To bond, you select the stash account, bond from it and designate a controller. Additionally you can select the amount of funds to bond and set your payout preferences.

# Nominating

Nomination (using the controller account as set as part of the bonding) is a process of selecting a number of validators (or potential validators) that you deem trustworthy. Once the validators are selected, the bonded value is assigned to participate in the network security.

At any point you could stop nominating (using the controller) or top up the funds bonded (from the stash).

# Validating

Validators run nodes that author blocks. The primary requirement here is the ability to run a node that is available 24/7 and is well-connected to the network.

In addition to the stash and controller account described above, a validator has to indicate an additional account called `Session key` -

- **Session** The seed for this key is passed to the node. It can be the same as the controller, but it is never recommended that it matches the stash. Since this account does not need to send transactions, it does not need to have funds available. (If the mode is ever compromised, the controller can set an new session key)

As with the nomination operations, you can stop validation at any time using the controller. (Be if for maintence, upgrades, or any other reason)
