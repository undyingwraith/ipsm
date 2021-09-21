# @undyingwraith/ipsm-core

This is the core libary for ipsm.

## Installing

Add the following line to your `.npmrc` file in your project or create it.

```text
@undyingwraith:registry=https://npm.pkg.github.com
```

And install it with:

```bash
yarn add @undyingwraith/ipsm-core
```

Or with npm:

```bash
npm install @undyingwraith/ipsm-core
```

## Basic usage

```typescript
const ipsm = new IpsmApp(ipfs, key)

ipsm.postToBoard('ipsm', {
	content: [
		{
			mime: 'text/plain',
			data: 'My first post on ipsm'
		}
	]
})
```

### Examples

- Check out the web app. [here](https://github.com/undyingwraith/ipsm/tree/master/packages/web)
- Check out the integrations repository. [here](https://github.com/undyingwraith/ipsm-integrations)
