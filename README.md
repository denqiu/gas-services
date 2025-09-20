# Installation

- This installs all modules: https://www.npmjs.com/package/googleapis.
- This installs auth library without having to install all modules: https://www.npmjs.com/package/google-auth-library.

# Google Cloud Setup

1. Enable Drive and Docs APIs.
1. Setup quota alert policies and email notification for drive and docs read/write. Notify on 80%. Only need to go through process once and then for the rest easy to create.
1. Create service account.
1. Download service account's json keys. Add to `.gitignore`, `.env`, and `CI/CD secret`.

## DocumentService

- Install `googleapis/drive`, `googleapis/docs`, and `google-auth-library`.

## EmailService