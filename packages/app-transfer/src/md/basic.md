# Transfer

This tab allows you to send funds from one account you own to another account.

# Minimum allowed balance

Accounts with a balance lower than the minimal amount, 100 miliUnits (miliDOTs for Polkadot) as of writing, are considered as inexistent for the network. If an account's balance ever drops below this amount, it is removed from the network. In this application, it will still be visible, but with a balance of 0.

For a fund transfer to a **new account** (read an account with a balance of 0), if the amount transferred is less than the minimum allowed balance, then the transfer will "succeed" but the destination account will not be created (read its balance will remain 0); this essentially burns the transfer balance from the sender, because the receiver's balance never exceed the minimum allowed balance.  

If the receiver already exists (read it has a balance greater than 0), it is perfectly possible to transfer very low amounts.

# Fees

Fees will be added to the transfer amount on top of the amount you wish to send.
An information box will show you the amount of fees that you will need to pay for the transfer and the total amount that will be deducted from the sender.

- transfer:  
  You need to pay fees to transfer funds from one account to the other in order to pay for the security of the network. 

- account creation
  In addition to the transfer fees, if you are sending funds to an account with a 0 balance, not only do you need to make sure to send enough funds (see the  "minimum allowed balance" section) but you will need to pay a creation fee. This is to prevent the generation of unused account.
