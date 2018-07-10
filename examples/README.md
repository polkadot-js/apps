# examples

This guide will take you through some basic examples in using the Components and API to build tools to extract information from a Substrate network client. It follows the line of a set of tutorials that will setup basic infrastructure, queies and then string these together into doing some more complex things.

## tutorials

- [Basic application scaffolding](tut-001.md) Show the setup of a new app in this framework. (Typically only needed when new top-level features are added)
- [Storage and pulling from storage](tut-002.md) Shows how to use the built-in components to show something basic from storage
- [Query storage via API](tut-003.md) Shows how to construct an API query to pull information from storage
- [Query storage, replace HOC](tut-004.md) Queries storage, replacing the previous use of our HOC
- [Combining proposal and intentions](tut-005.md) Using the information collected previously, combine the displays
- [Showing selected validators](tut-006.md) Expand on intentions, filtering with current validators
- [Sorting intentions by balance](tut-007.md) Cleanup our display, sorting the intentions by balance

## ... and in the end ...

You will know how to use UI components and the API to render a mapping of intentions, their balanances to proposals

![final](https://raw.githubusercontent.com/polkadot-js/apps/master/examples/final.png)
