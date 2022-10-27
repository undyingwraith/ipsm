# @undyingwraith/ipsm-client

This is the client libary for ipsm.
This library includes `@undyingwraith/ipsm-core`, theres no need to add it as a dependency.

## Installing

Add the following line to your `.npmrc` file in your project or create it.

```text
@undyingwraith:registry=https://npm.pkg.github.com
```

And install it with:

```bash
yarn add @undyingwraith/ipsm-client
```

Or with npm:

```bash
npm install @undyingwraith/ipsm-client
```

## Basic usage

```typescript
const ipsm = new IpsmClientApp(ipfs, key)

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
