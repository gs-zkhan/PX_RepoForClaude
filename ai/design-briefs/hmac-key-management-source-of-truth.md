# HMAC Key Management — Quick Review

**Jira:** [APP-49087](https://gainsight.atlassian.net/browse/APP-49087)

## Proposed design

Add an **HMAC keys** section to the existing PX **Identity verification** page while retaining the current toggle, secret generator, and Hash Calculator.

The section will provide:

- `X of 25 keys active` and a **Register key** action.
- A table showing the registered key and nonce, created date, created by, expiry date, days remaining, status, and Rotate. Sensitive values are masked by default with reveal and Copy actions.
- Warning treatment when a key has 14 days or fewer remaining.
- Registration followed by a success modal that shows the generated nonce with Copy.
- Rotation confirmation with a concise note that the previous nonce may remain valid for up to two minutes, following the existing application convention.
- Empty, loading, error, expiring, and at-cap states.

## Assumptions we will use

- Maximum 25 active keys per subscription.
- Keys expire after 90 days.
- The user is an authorized customer subscription admin.
- The customer email is the source of truth for visibility: both the key and nonce remain available to customer admins for audit, using the same masked/reveal treatment as the current HMAC secret.
- The authenticated GET API remains a server-to-server recovery mechanism and is not exposed as a new UI flow.
- Register and Rotate are immediate actions, independent of the page Save button.
- Delete is deferred from the first release.
- Approach 3B uses a separate rollout flag.
- “Validation” means required-field, duplicate-key, and active-key-limit checks only. It does not add checksum or user-ID hash calculation; the existing Hash Calculator remains unchanged.

## Feedback incorporated

- Place key management below the existing Identity verification settings and retain the legacy controls.
- Customer admins manage keys; Delete remains out of the first release.
- Show both the registered key and nonce in PX for audit, masked by default.
- Continue with the 25-key backend/UI limit unless Product changes it during screen review.
- Keep the two-minute grace-period explanation inside the Rotate confirmation rather than as permanent page copy.
- Do not add a new checksum or user-ID validation flow.

## What Design will show next

1. Updated Identity verification page.
2. Empty and populated key-management states.
3. Register-key interaction with basic form validation.
4. Registration success and nonce display modal.
5. Rotate-key confirmation and success flow.

After this first review, we can resolve any remaining details directly on the proposed screens.
