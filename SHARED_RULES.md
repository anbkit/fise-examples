# Shared Rules Configuration

This document explains the shared rules system used across frontend and backend demos.

## Overview

The shared rules are now organized as a proper monorepo package (`@fise-examples/shared`) containing all FISE rules configurations used by both the React frontend and Fastify backend. This ensures client and server always use identical encryption rules for each demo scenario.

## File Structure

```
fise/
├── examples/
│   ├── shared/                          # Shared package
│   │   ├── package.json                 # Package configuration
│   │   └── src/
│   │       ├── index.js                 # Main export
│   │       └── shared-rules.js          # Rules configuration
│   ├── backend-fastify/
│   │   └── routes/                      # Backend imports from @fise-examples/shared
│   └── frontend-react/
│       └── src/components/demos/        # Frontend imports from @fise-examples/shared
```

## Available Rules

### 1. `defaultRules` - General API Endpoints
```javascript
FiseBuilder.defaults().withSaltRange(15, 50)
```
- **Used by:** user-data, products, analytics
- **Security Level:** Medium
- **Features:** Timestamp-based offset, base36 encoding
- **Best for:** Standard API responses

### 2. `authRules` - Authentication & Tokens
```javascript
FiseBuilder.timestamp().withSaltRange(20, 40)
```
- **Used by:** login, session tokens
- **Security Level:** High
- **Features:** Heavy timestamp dependency, changes every minute
- **Best for:** Session management, temporary tokens

### 3. `formRules` - Form Submissions
```javascript
FiseBuilder.multiFactor().withSaltRange(25, 60)
```
- **Used by:** form submissions, user input
- **Security Level:** High
- **Features:** Multi-factor offset (length + timestamp + prime)
- **Best for:** Sensitive user data, form protection

### 4. `sensitiveRules` - High-Security Data
```javascript
FiseBuilder.multiFactor()
  .withSaltRange(40, 100)
  .withOffset((cipherText, ctx) => {
    const len = cipherText.length || 1
    const t = ctx.timestamp ?? 0
    const charCode = cipherText.charCodeAt(0) || 0
    return (len * 7 + t * 13 + charCode * 3) % len
  })
```
- **Used by:** API keys, credentials, secrets
- **Security Level:** Very High
- **Features:** Maximum salt range, complex offset calculation
- **Best for:** API keys, tokens, passwords

### 5. `demoRules` - Testing & Comparison
```javascript
FiseBuilder.simple().withSaltRange(10, 20)
```
- **Used by:** comparison demo, testing
- **Security Level:** Low
- **Features:** Simple fixed offset, minimal salt
- **Best for:** Demonstrations, testing

### 6. `storageRules` - Client-Side Storage
```javascript
FiseBuilder.lengthBased().withSaltRange(15, 35)
```
- **Used by:** localStorage, static content
- **Security Level:** Medium
- **Features:** No timestamp dependency, length-based offset
- **Best for:** Browser storage, offline data

## Demo-to-Rules Mapping

| Demo       | Rule Key     | Rule Name            | Security  | Timestamp? |
| ---------- | ------------ | -------------------- | --------- | ---------- |
| user-data  | `user-data`  | Default Rules        | medium    | ✓          |
| products   | `products`   | Default Rules        | medium    | ✓          |
| login      | `login`      | Authentication Rules | high      | ✓          |
| form       | `form`       | Multi-Factor Rules   | high      | ✓          |
| api-key    | `api-key`    | Sensitive Data Rules | very-high | ✓          |
| analytics  | `analytics`  | Default Rules        | medium    | ✓          |
| comparison | `comparison` | Demo Rules           | low       | ✓          |
| storage    | `storage`    | Storage Rules        | medium    | ✗          |

## Usage

### Backend (routes/*.js)

```javascript
import { getRulesForDemo } from '@fise-examples/shared'

// Encrypt user data
const encrypted = encryptFise(
  JSON.stringify(userData),
  xorCipher,
  getRulesForDemo('user-data'),
  { timestamp: getTimestamp() }
)

// Decrypt form data
const decrypted = decryptFise(
  encryptedData,
  xorCipher,
  getRulesForDemo('form'),
  { timestamp: getTimestamp() }
)
```

### Frontend (components/demos/*.jsx)

```javascript
import { getRulesForDemo, RULES_METADATA } from '@fise-examples/shared'

// Decrypt API response
const plaintext = decryptFise(
  data,
  xorCipher,
  getRulesForDemo('user-data'),
  { timestamp: getTimestamp() }
)

// Display rule info
<span className="badge">Rules: {RULES_METADATA['user-data'].name}</span>
<span className="badge">Security: {RULES_METADATA['user-data'].security}</span>
```

## Benefits

### 1. **Consistency**
- Client and server always use the same rules
- No configuration drift between frontend and backend
- Single source of truth for all demos

### 2. **Maintainability**
- Update rules in one place
- Changes automatically propagate to both sides
- Easy to add new rule configurations

### 3. **Documentation**
- Self-documenting with metadata
- Clear security levels for each demo
- Timestamp requirements explicitly stated

### 4. **Type Safety**
- Central import ensures no typos
- getRulesForDemo() provides single access point
- Metadata includes descriptions

## Adding New Rules

To add a new rule configuration:

1. **Define the rule** in `shared/src/shared-rules.js`:
```javascript
export const myNewRules = FiseBuilder.custom()
  .withSaltRange(20, 50)
  .build()
```

2. **Add to DEMO_RULES mapping**:
```javascript
export const DEMO_RULES = {
  // ... existing rules
  'my-demo': myNewRules
}
```

3. **Add metadata**:
```javascript
export const RULES_METADATA = {
  // ... existing metadata
  'my-demo': {
    name: 'My Custom Rules',
    description: 'Description of what these rules do',
    security: 'medium',
    timestampRequired: true
  }
}
```

4. **Use in backend**:
```javascript
const encrypted = encryptFise(
  data,
  xorCipher,
  getRulesForDemo('my-demo'),
  { timestamp: getTimestamp() }
)
```

5. **Use in frontend**:
```javascript
const decrypted = decryptFise(
  encrypted,
  xorCipher,
  getRulesForDemo('my-demo'),
  { timestamp: getTimestamp() }
)
```

## Security Considerations

### Timestamps
- Most rules use timestamps for temporal security
- Both client and server must use current minute: `Math.floor(Date.now() / 60000)`
- System clocks should be reasonably synchronized

### Rule Secrecy
- In production, rules configuration should be kept secret
- Don't commit actual production rules to public repositories
- Use environment variables for production rule parameters

### Salt Ranges
- Larger salt ranges = more security but longer encrypted strings
- Balance security needs with performance requirements
- Typical ranges: 15-50 for standard, 40-100 for high security

## Testing

To verify rules are working correctly:

```javascript
// Test encryption/decryption
const plaintext = 'test data'
const rules = getRulesForDemo('user-data')
const timestamp = Math.floor(Date.now() / 60000)

const encrypted = encryptFise(plaintext, xorCipher, rules, {
  timestamp: timestamp
})

const decrypted = decryptFise(encrypted, xorCipher, rules, {
  timestamp: timestamp
})

console.assert(decrypted === plaintext, 'Rules must be reversible!')
```

## Troubleshooting

### Decryption Fails

**Problem:** `Failed to decrypt` error

**Solutions:**
1. Check that both sides use the same rule key
2. Verify timestamp is the same on both sides (within same minute)
3. Ensure rules configuration hasn't changed
4. Confirm cipher function is identical

### Different Results

**Problem:** Same input produces different encrypted output

**Expected:** This is normal! Salt is random, so each encryption is unique
**Issue:** If decryption fails, rules may not match

### Import Errors

**Problem:** Cannot find module `@fise-examples/shared`

**Solution:**
1. Ensure you've run `npm install` at the root directory to link workspace packages
2. Import from `@fise-examples/shared` instead of relative paths
3. Both backend and frontend use the same import: `import { getRulesForDemo } from '@fise-examples/shared'`

## Best Practices

1. **Always use getRulesForDemo()** - Don't create rules inline
2. **Include rule info in UI** - Show users which rules are active
3. **Test after changes** - Verify encryption/decryption still works
4. **Document custom rules** - Add clear metadata for new configurations
5. **Keep timestamps synced** - Use same timestamp calculation everywhere

## Future Enhancements

Potential improvements:

- [ ] Add rule versioning for backwards compatibility
- [ ] Create rule validation tests
- [ ] Add performance benchmarks for each rule
- [ ] Implement rule rotation strategies
- [ ] Add rule selection based on data sensitivity
- [ ] Create rule recommendation system

## Related Documentation

- [INTEGRATION.md](frontend-react/INTEGRATION.md) - Backend integration guide
- [FEATURES.md](frontend-react/FEATURES.md) - Complete feature list
- [README.md](README.md) - Main project documentation
