## Installation

Node version: 20.15.1

- This installs all modules: https://www.npmjs.com/package/googleapis.
- This installs auth library without having to install all modules: https://www.npmjs.com/package/google-auth-library.

## Dev Notes

### DocumentService

- Install `googleapis/drive`, `googleapis/docs`, and `google-auth-library`.

### EmailService

## Google Cloud Setup

### [GitHub Actions Auth and Detailed Setup Guide](https://github.com/google-github-actions/auth): Click arrows to expand detailed instructions on WIF via direct setup, service account setup, legacy json keys setup.
### [Blog Guide](https://cloud.google.com/blog/products/identity-security/enabling-keyless-authentication-from-github-actions)
### Google Cloud Platform Notes
1. Enable Drive and Docs APIs.
1. Setup quota alert policies and email notification for drive and docs read/write. Notify on 80%. Only need to go through process once and then for the rest easy to create.
1. Create service account.
1. Create WIF (Workload Identity Federation). Not Workforce, Workload. See [best practices](https://cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys?hl=en&_gl=1*1t6kjca*_ga*NDQ2MDI1NzMxLjE3NTY0MzUyODA.*_ga_WH2QY8WWF5*czE3NTgzNTEyMjUkbzE5JGcxJHQxNzU4MzUxMjU1JGozMCRsMCRoMA..) and [decision tree](https://cloud.google.com/docs/authentication?hl=en#auth-decision-tree).
1. Create Workload Identity pool. https://cloud.google.com/iam/docs/workload-identity-federation?hl=en&_gl=1
1. See Github OIDC: https://docs.github.com/en/actions/reference/security/oidc.
1. Issuer url is `issuer` value in https://token.actions.githubusercontent.com/.well-known/openid-configuration.