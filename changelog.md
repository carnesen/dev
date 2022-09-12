# **@carnesen/dev** changelog

## Upcoming

## carnesen-dev-0.4.0 (2022-09-11)



## carnesen-dev-0.3.1 (2022-04-28)

- Fix: `pr` command fails when changes have already been committed (https://github.com/carnesen/dev/issues/33)

## carnesen-dev-0.3.0 (2022-04-11)

- Feature: "clone" for cloning arbitrary repo off of GitHub by its id e.g. "carnesen-dev clone colinhacks/zod".

- Breaking: Remove commands "locals list" "remotes list". Rename "locals status" --> "status", "remotes clone" --> "clone-carnesens"

## carnesen-dev-0.2.1 (2022-03-09)

- Fix "init" command in published package. Several files are excluded from the published package by npm which makes it difficult to use it as a template. Ref: https://github.com/npm/npm/issues/3763.

## carnesen-dev-0.2.0 (2022-02-27)

- Feature: Add semver bump "prenone" which neither bumps the version nor does Git operations like a "prerelease" bump

- Fix: In "release", "git commit" fails when there are no changes

- Breaking: Rename command "locals init" as "init" operating on the current working directory

- Feature: In "init" command get fancier with making the files new-project specific

## carnesen-dev-0.1.1 (2022-02-25)

- Fix a fatal bug in "locals init" command

## carnesen-dev-0.1.0 (2022-02-25)

- Feature: Support standard semantic version bumps "preminor", "prepatch", "premajor"

- Feature: Support novel semantic version version bump  "date" and "predate" for date-based versioning e.g. "2022.11.0"

## carnesen-dev-0.0.0 (2022-02-25)

Initial release
