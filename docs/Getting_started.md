# Getting started

## Pre-Requisites
- [yarn](https://yarnpkg.com/)
- An ipfs node with the api reachable on localhost:5001

## Getting started

1. Clone this repo
2. run `yarn install` to install all dependencies

## Architecture

This app is written entirely in Typescript.
And is using [lerna]() to manage the different modules.
Those are:
- core - The core library, implements the communication protocols.
- relay - A headless app that helps with delivering and syncing posts.
- web - A web app using react, that allows you to view/receive/sync and add posts
