# Security Review Command

Complete a security review of the pending changes on the current branch.

## Usage

Run `/security-review` to start the focused security review.

## What It Does

- Analyzes the current branch's pending changes for security vulnerabilities
- Uses deep semantic understanding beyond simple pattern matching
- Provides contextual understanding of code semantics and intent
- Comments on relevant code lines with findings

## Vulnerability Types Detected

- **Injection Attacks**: SQL, command, LDAP, XPath, NoSQL, XXE
- **Authentication & Authorization**: Broken auth, privilege escalation, insecure direct object references
- **Data Exposure**: Hardcoded secrets, sensitive data logging, PII violations
- **Cryptographic Issues**: Weak algorithms, improper key management
- **Input Validation**: Missing validation, improper sanitization, buffer overflows
- **Business Logic Flaws**: Race conditions, TOCTOU issues
- **Configuration Security**: Insecure defaults, missing security headers
- **Supply Chain**: Vulnerable dependencies, typosquatting risks
- **Code Execution**: RCE via deserialization, pickle/eval injection
- **Cross-Site Scripting (XSS)**: Reflected, stored, and DOM-based XSS

## False Positive Filtering Automatically Excludes

- Denial of Service vulnerabilities
- Rate limiting concerns
- Memory/CPU exhaustion issues
- Generic input validation without proven impact
- Open redirect vulnerabilities

## Customization

1. Copy this file to `.claude/commands/` in your project
2. Edit to add organization-specific security directions
3. Configure custom false positive filtering via `false-positive-filtering-instructions`
4. Append custom security scan instructions via `custom-security-scan-instructions`

## Running the Review

```bash
/security-review
```

This will analyze pending changes and report any security findings.

## License

MIT License - see LICENSE file in the original repository.