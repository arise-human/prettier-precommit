# prettier-staged

A cross-platform NodeJS script that formats staged files using
[Prettier](https://prettier.io/).

Most useful when used as a
[Git pre-commit hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks),
possibly installed with a tool like
[husky](https://www.npmjs.com/package/husky).

Since it is implemented in Node, it is cross-platform and will work on any OS
with Node installed.

This tool respects any configuration that would normally be recognized by
Prettier, such as `.prettierrc` or the `prettier` config in `package.json`.

## Installation

```
npm i -D prettier-staged
```

## Usage

### CLI

```
npx prettier-staged
```

### Git Hook

Install to your git hooks, using one of these methods:

- use [husky](https://www.npmjs.com/package/husky) (see the
  [example husky config](#example-huskyrc))
- OR, symlink `node_modules/prettier-staged/index.js` to `.git/hooks/pre-commit`
- OR, add `npx prettier-staged` to your existing `.git/hooks/pre-commit`

### Example `.huskyrc`

```json
{
  "hooks": {
    "pre-commit": "npx prettier-staged"
  }
}
```
