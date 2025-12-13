# Vaultogether - Implementation Guide

## Overview
This guide explains the CRUD (Create, Read, Update, Delete) operations implemented in the Vaultogether password manager application.

## Architecture

### Type Definitions (`/types/vault.ts`)
```typescript
- Vault: Main vault entity with user roles
- VaultItem: Password items stored in vaults
- VaultMember: Users with access to vaults
- UserRole: 'owner' | 'editor' | 'viewer'
```

### Components Structure
```
/App.tsx                    - Main application with state management
/components/
  - VaultList.tsx          - Vault listing and creation
  - VaultItems.tsx         - Password items CRUD
  - VaultMembers.tsx       - Member management
  - PasswordGenerator.tsx  - Password generation utility
```

## CRUD Operations Implementation

### 1. VAULT CRUD (VaultList.tsx)

#### CREATE - Add New Vault
**Location:** `App.tsx` → `handleCreateVault()`
```typescript
- Creates new Vault with unique ID and timestamp
- Sets creator as 'owner' role
- Automatically adds creator to VaultMembers
- Updates vaults state array
```

**UI Flow:**
1. Click "Create New Vault" button
2. Fill in name and description (optional)
3. Submit to create vault
4. Vault appears in grid with 0 items, 1 member

#### READ - View Vaults
**Location:** `VaultList.tsx`
```typescript
- Displays all vaults in responsive grid
- Shows vault metadata: name, description, role, item count, member count
- Role badges differentiate access levels
- Empty state shown when no vaults exist
```

#### UPDATE - Modify Vault
**Current Implementation:** Not directly implemented
**Future Enhancement:** Could add vault name/description editing

#### DELETE - Remove Vault
**Location:** `App.tsx` → `handleDeleteVault()`
```typescript
- Only 'owner' role can delete vaults
- Shows confirmation dialog
- Cascades deletion:
  - Removes vault from vaults array
  - Removes all associated items
  - Removes all associated members
```

**UI Flow:**
1. Hover over vault card (trash icon appears)
2. Click trash icon
3. Confirm deletion
4. Vault and all related data removed

---

### 2. VAULT ITEMS CRUD (VaultItems.tsx)

#### CREATE - Add Password Item
**Location:** `App.tsx` → `handleCreateItem()`
```typescript
- Available for 'owner' and 'editor' roles only
- Generates unique ID and timestamps
- Associates item with current vault
- Updates vault's itemCount
```

**UI Flow:**
1. Click "Add Password Item" or "Generate Password"
2. Fill form fields:
   - Title/Service (required)
   - Username/Email (required)
   - Password (required) - can use generator
   - URL (optional)
   - Notes (optional)
3. Submit to create
4. Item appears in list

**Integration with Password Generator:**
- Click key icon to open password generator
- Generate password and copy
- Return to form and paste

#### READ - View Items
**Location:** `VaultItems.tsx`
```typescript
- Filters items by selected vault ID
- Shows all item metadata
- Passwords hidden by default (••••••••)
- Toggle visibility per item
- Copy password to clipboard
- Shows creation/update timestamps
```

**UI Features:**
- Eye icon: Toggle password visibility
- Copy icon: Copy password (shows checkmark on success)
- External link: Opens URL in new tab
- Notes displayed below main fields

#### UPDATE - Edit Item
**Location:** `App.tsx` → `handleUpdateItem()`
```typescript
- Available for 'owner' and 'editor' roles
- Loads existing item data into form
- Updates specific fields while preserving others
- Sets new updatedAt timestamp
```

**UI Flow:**
1. Hover over item (edit icon appears)
2. Click edit icon
3. Form populates with existing data
4. Modify fields
5. Submit to update
6. Changes reflected immediately

#### DELETE - Remove Item
**Location:** `App.tsx` → `handleDeleteItem()`
```typescript
- Available for 'owner' and 'editor' roles
- Shows confirmation dialog
- Removes item from vaultItems array
- Decrements vault's itemCount
```

**UI Flow:**
1. Hover over item (trash icon appears)
2. Click trash icon
3. Confirm deletion
4. Item removed, count updated

---

### 3. VAULT MEMBERS CRUD (VaultMembers.tsx)

#### CREATE - Add Member
**Location:** `App.tsx` → `handleAddMember()`
```typescript
- Only 'owner' can add members
- Requires username, email, and role selection
- Generates unique member ID
- Updates vault's memberCount
```

**UI Flow:**
1. Click "Add Member" button
2. Enter username and email
3. Select role (viewer/editor/owner)
4. Submit to add
5. Member appears in list with role badge

**Role Selection:**
- Visual cards for each role
- Icons and descriptions for clarity
- Can assign any role including owner

#### READ - View Members
**Location:** `VaultMembers.tsx`
```typescript
- Filters members by selected vault ID
- Displays username, email, role, and join date
- Role badges with color coding:
  - Owner: Black background
  - Editor: Blue background
  - Viewer: Gray background
- Shows role legend at top
```

#### UPDATE - Change Member Role
**Location:** `App.tsx` → `handleUpdateMemberRole()`
```typescript
- Only 'owner' can update roles
- Cannot modify other owners
- Dropdown select for role change
- Immediately updates member role
```

**UI Flow:**
1. View member list
2. Select new role from dropdown (only for non-owners)
3. Role updates immediately
4. Badge color changes

#### DELETE - Remove Member
**Location:** `App.tsx` → `handleRemoveMember()`
```typescript
- Only 'owner' can remove members
- Cannot remove vault owners
- Shows confirmation dialog
- Decrements vault's memberCount
- Minimum 1 member enforced
```

**UI Flow:**
1. Hover over member (trash icon appears)
2. Click trash icon
3. Confirm removal
4. Member removed, count updated

---

## Role-Based Access Control (RBAC)

### Owner Role
- Full control over vault
- Create, edit, delete items
- Add, remove, change member roles
- Delete entire vault
- Manage all aspects

### Editor Role
- Create, edit, delete items
- View all items and passwords
- Cannot manage members
- Cannot delete vault
- Focus on content management

### Viewer Role
- Read-only access
- View items and passwords
- Cannot create, edit, or delete
- Cannot see member management
- Minimal permissions

### UI Adaptations
```typescript
const canEdit = vault.userRole === 'owner' || vault.userRole === 'editor';
const isOwner = vault.userRole === 'owner';
```

Buttons and forms conditionally rendered based on role:
- Add Item button: Only for owner/editor
- Edit/Delete icons: Only for owner/editor
- Member management: Only for owner
- Vault deletion: Only for owner

---

## State Management

### Global State (App.tsx)
```typescript
[vaults, setVaults]           // All vaults
[vaultItems, setVaultItems]   // All password items
[vaultMembers, setVaultMembers] // All members
[selectedVault, setSelectedVault] // Current vault context
[isAuthenticated, setIsAuthenticated] // Auth state
```

### Data Flow
1. User authenticates → `isAuthenticated = true`
2. Navigate to VaultList → View all vaults
3. Select vault → `selectedVault` set, navigate to VaultItems/VaultMembers
4. Perform CRUD → Update respective state array
5. Related counts auto-update via state mapping

### State Update Patterns

**Adding Items:**
```typescript
setVaultItems(prev => [...prev, newItem])
setVaults(prev => prev.map(v => 
  v.id === selectedVault.id 
    ? { ...v, itemCount: v.itemCount + 1 } 
    : v
))
```

**Updating Items:**
```typescript
setVaultItems(prev => prev.map(item =>
  item.id === id 
    ? { ...item, ...updates, updatedAt: new Date() } 
    : item
))
```

**Deleting Items:**
```typescript
setVaultItems(prev => prev.filter(item => item.id !== id))
setVaults(prev => prev.map(v =>
  v.id === selectedVault.id
    ? { ...v, itemCount: Math.max(0, v.itemCount - 1) }
    : v
))
```

---

## Navigation Flow

```
Login/Register (auth)
    ↓
VaultList (authenticated)
    ↓ (click vault)         ↓ (click settings)
VaultItems                  VaultMembers
    ↓ (back)                   ↓ (back)
VaultList                   VaultList
```

**View States:**
- `'auth'` - Login/Register screen
- `'generator'` - Password generator (accessible from anywhere)
- `'vaultList'` - Main vault dashboard
- `'vaultItems'` - Password items for selected vault
- `'vaultMembers'` - Member management for selected vault

---

## Backend Integration Guide

### For Your Coursework Backend

When implementing your custom Spring backend with JWT, Argon2id, and AES-GCM:

#### 1. Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

Replace mock authentication:
```typescript
// Current (mock):
setIsAuthenticated(true);
setView('vaultList');

// With backend:
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
const { token, user } = await response.json();
localStorage.setItem('jwt', token);
setCurrentUser(user);
setIsAuthenticated(true);
```

#### 2. Vault Endpoints
```
GET    /api/vaults              - List user's vaults
POST   /api/vaults              - Create vault
GET    /api/vaults/:id          - Get vault details
PUT    /api/vaults/:id          - Update vault
DELETE /api/vaults/:id          - Delete vault
```

#### 3. Vault Items Endpoints
```
GET    /api/vaults/:vaultId/items       - List items
POST   /api/vaults/:vaultId/items       - Create item
GET    /api/vaults/:vaultId/items/:id   - Get item
PUT    /api/vaults/:vaultId/items/:id   - Update item
DELETE /api/vaults/:vaultId/items/:id   - Delete item
```

#### 4. Members Endpoints
```
GET    /api/vaults/:vaultId/members     - List members
POST   /api/vaults/:vaultId/members     - Add member
PUT    /api/vaults/:vaultId/members/:id - Update role
DELETE /api/vaults/:vaultId/members/:id - Remove member
```

#### 5. AuthFilter Implementation
```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) {
        String token = extractToken(request);
        if (token != null && jwtUtil.validateToken(token)) {
            // Set security context
            Authentication auth = jwtUtil.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        filterChain.doFilter(request, response);
    }
}
```

#### 6. Password Encryption (AES-GCM)
Backend should:
1. Receive plaintext password from frontend
2. Encrypt using AES-GCM with user's master key
3. Store encrypted password in database
4. Decrypt when sending back to authorized user

#### 7. Fetch Integration Example
```typescript
const handleCreateItem = async (item) => {
  const response = await fetch(`/api/vaults/${selectedVault.id}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    },
    body: JSON.stringify(item)
  });
  
  if (response.ok) {
    const newItem = await response.json();
    setVaultItems(prev => [...prev, newItem]);
  }
};
```

---

## Security Considerations

### Current Implementation (Frontend Only)
- Demo data with mock authentication
- State stored in memory only
- No actual encryption (simulated)
- Passwords visible in client-side state

### Production Requirements (Your Backend)
1. **Authentication**
   - JWT tokens in HttpOnly cookies
   - Secure, SameSite=Strict flags
   - Token refresh mechanism
   - CSRF protection

2. **Password Hashing**
   - Argon2id for user passwords
   - Salt per user
   - Appropriate cost parameters

3. **Data Encryption**
   - AES-GCM for vault items
   - Key derivation from master password
   - Never store plaintext passwords
   - Encrypted at rest in database

4. **Authorization**
   - Role checks on every request
   - Verify vault ownership/membership
   - Prevent privilege escalation
   - Audit logging

5. **Transport Security**
   - HTTPS only in production
   - CORS properly configured
   - No sensitive data in URLs
   - Secure headers (HSTS, CSP, etc.)

---

## Demo Data

The application includes sample data for demonstration:

### 3 Vaults
1. **Personal** (Owner) - 3 items, 1 member
2. **Work** (Owner) - 2 items, 2 members
3. **Family Shared** (Editor) - 1 item, 3 members

### 6 Password Items
- GitHub, Gmail, Netflix (Personal vault)
- Slack, Jira (Work vault)
- Disney+ (Family Shared vault)

### 6 Members
- Demonstrates owner, editor, and viewer roles across vaults
- Shows multi-user vault sharing

---

## Testing the Application

### 1. Authentication
- Click "Login" (no validation in demo)
- Redirects to vault list

### 2. Vault Management
- Create new vault with name/description
- View vault cards with metadata
- Delete owned vaults (confirmation required)
- Open vaults to view items

### 3. Item Management
- Add password items with all fields
- Use password generator integration
- Edit existing items
- Toggle password visibility
- Copy passwords to clipboard
- Delete items (confirmation required)

### 4. Member Management
- Add members with role selection
- View member list with role badges
- Change member roles (dropdown)
- Remove members (confirmation required)
- Observe role-based UI changes

### 5. Role Testing
- Switch between vaults with different roles
- Verify editor cannot manage members
- Verify viewer cannot edit items
- Verify owner has full control

---

## Future Enhancements

### Recommended Features
1. **Search & Filter**
   - Search items by title/username
   - Filter vaults by role
   - Tag system for items

2. **Password Strength Indicator**
   - On items list
   - Warning for weak passwords
   - Auto-suggest regeneration

3. **Audit Log**
   - Track item access
   - Member changes
   - Login history

4. **Two-Factor Authentication**
   - TOTP support
   - Backup codes
   - SMS/Email options

5. **Password Sharing**
   - Temporary access links
   - Expiring shares
   - View-only shares

6. **Import/Export**
   - CSV import
   - JSON export
   - Browser extension integration

7. **Vault Editing**
   - Rename vaults
   - Change descriptions
   - Archive/restore

8. **Bulk Operations**
   - Multi-select items
   - Bulk delete
   - Move between vaults

---

## Conclusion

This implementation provides a complete CRUD interface for a password manager with role-based access control. The frontend is ready to be connected to your custom Spring backend implementing:

- JWT-based stateless authentication
- Argon2id password hashing
- AES-GCM encryption at rest
- Custom AuthFilter
- Role-based authorization

All UI components follow the monospace "Fira Mono" aesthetic from your original Figma design, creating a cohesive and professional interface suitable for coursework demonstration.
