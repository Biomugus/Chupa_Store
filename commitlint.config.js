// commitlint.config.js
// Validates commit messages against Conventional Commits spec.
// Docs: https://commitlint.js.org

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed commit types
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation only
        'style',    // Formatting, no logic change
        'refactor', // Code restructure, no feature/fix
        'perf',     // Performance improvement
        'test',     // Adding/fixing tests
        'build',    // Build system or dependencies
        'ci',       // CI/CD configuration
        'chore',    // Misc tasks (e.g. config)
        'revert',   // Revert a previous commit
      ],
    ],
    // Type must be lowercase: feat, fix, etc.
    'type-case': [2, 'always', 'lower-case'],
    // Subject must be lowercase
    'subject-case': [2, 'always', 'lower-case'],
    // Subject must NOT end with a period
    'subject-full-stop': [2, 'never', '.'],
    // Subject must not be empty
    'subject-empty': [2, 'never'],
    // Header (type + scope + subject) max 72 chars
    'header-max-length': [2, 'always', 72],
    // Each line in body max 150 chars
    'body-max-line-length': [2, 'always', 150],
  },
};