# prettier-precommit

A NodeJS
[pre-commit hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) that
formats staged files using [Prettier](https://prettier.io/).

Since it is implemented in Node, it is cross-platform and will work on any OS
with Node installed.

This tool respects any configuration files that would normally be recognized by
Prettier.

## Usage

Install to your git hooks, either by symlinking
`node_modules/prettier-precommit/pre-commit.js` to `.git/hooks/pre-commit` or by
using a tool like [husky](https://www.npmjs.com/package/husky).

Can be run as a CLI, in which case it has the same behavior.

```
$ npx prettier-precommit
```

### Example `.huskyrc`

```json
{
  "hooks": {
    "pre-commit": "npx prettier-precommit"
  }
}
```
