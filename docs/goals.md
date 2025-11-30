# VAULTOGETHER - COMPREHENSIVE PROJECT SPECIFICATION

---

## 1. PROJECT OVERVIEW

**Project Name:** Vaultogether

**Type:** Password Manager / Secure Vault Web Application

**Purpose:** Allow users to securely store, manage, and share passwords and sensitive information (secure notes, cards) in encrypted vaults with role-based access control.

**Academic Context:**

- **Course:** CET3049 - Modern Full Stack Development with Java (Capstone Project)
- **Requirements:** Full-stack CRUD web application with React frontend, Spring Boot backend, MariaDB database, JPA/Spring Data (no raw SQL), proper OOP, RESTful APIs, 4 milestone submissions + presentation.

---

## 2. CORE FEATURES

## MVP (Minimum Viable Product)

1. **User Registration & Authentication:** Sign up, login, session management
2. **Vault Management:** Create, read, update, delete vaults
3. **Vault Item Management:** Store passwords/secure notes/cards in vaults (CRUD operations)
4. **Vault Sharing:** Add members to vaults with roles (owner, editor, viewer)
5. **Audit Logging:** Track all user actions (create, update, delete, view)
6. **Basic Security:** Password hashing, user-specific access control

## Future Enhancements (Post-MVP)

- Field-level encryption (AES-GCM for vault items)
- Key sharing/wrapping per user
- Key rotation
- Multi-factor authentication (MFA)
- Password strength checker
- Import/export functionality
- Real-time notifications

---

## 3. TECHNOLOGY STACK

## Frontend

- **Framework:** React JS (Create React App or Vite)
- **HTTP Client:** Axios or Fetch API
- **Styling:** CSS/Bootstrap/Material-UI (optional)

## Backend

- **Framework:** Spring Boot (Java)
- **Architecture:** RESTful Web Services
- **ORM:** Spring Data JPA
- **Security:** Spring Security (basic auth, bcrypt password hashing)
- **Build Tool:** Maven or Gradle

## Database

- **DBMS:** MariaDB (MySQL compatible)
- **Access:** Spring Data JPA repositories only (no raw SQL in application code)

## Development Tools

- **IDE:** IntelliJ IDEA, VS Code
- **Database Tool:** DBeaver
- **Version Control:** Git
- **API Testing:** Postman, curl
- **Diagramming:** Draw.io, dbdiagram.io

---

## 4. DATABASE SCHEMA

## Tables (6 Total)

## 4.1 users

`textusers
------------------------------------
PK  user_id        BIGINT AUTO_INCREMENT
    email          VARCHAR(255) NOT NULL UNIQUE
    password_hash  VARCHAR(255) NOT NULL
    kdf            VARCHAR(24)          [Future: KDF name]
    kdf_params     TEXT                 [Future: JSON KDF params]
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
    updated_at     DATETIME ON UPDATE CURRENT_TIMESTAMP

Notes:
- Each user account for the application
- password_hash: For now plaintext or bcrypt; future: Argon2id
- kdf/kdf_params: Reserved for future cryptographic key derivation`

## 4.2 vaults

`textvaults
------------------------------------
PK  vault_id       BIGINT AUTO_INCREMENT
FK  user_id        BIGINT NOT NULL → users.user_id
    name           VARCHAR(100) NOT NULL
    key_version    INT DEFAULT 1        [Future: key rotation support]
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP

Notes:
- Each vault is owned by a user (creator)
- Can contain multiple vault_items
- Can have multiple members (via vault_members)
- key_version: For future key rotation tracking`

## 4.3 vault_items

`textvault_items
------------------------------------
PK  item_id        BIGINT AUTO_INCREMENT
FK  vault_id       BIGINT NOT NULL → vaults.vault_id
    title          VARCHAR(100)
    type           VARCHAR(16)          [login, secure_note, card]
    enc_payload    TEXT                 [For now: JSON/plaintext; Future: BLOB/AES-GCM]
    enc_iv         VARCHAR(32)          [Future: Initialization Vector]
    enc_tag        VARCHAR(32)          [Future: Auth tag for AES-GCM]
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
    updated_at     DATETIME ON UPDATE CURRENT_TIMESTAMP

Notes:
- Stores sensitive information (passwords, notes, card details)
- Only title and type are plaintext/searchable
- enc_payload: Currently stores JSON; future will be encrypted BLOB
- enc_iv/enc_tag: Reserved for future AES-GCM encryption`

## 4.4 vault_members (Join Table)

`textvault_members
------------------------------------
PK,FK  vault_id    BIGINT NOT NULL → vaults.vault_id
PK,FK  user_id     BIGINT NOT NULL → users.user_id
       role        ENUM('owner','editor','viewer')
       added_at    DATETIME DEFAULT CURRENT_TIMESTAMP

Composite PK: (vault_id, user_id)

Notes:
- Many-to-many relationship between users and vaults
- Represents vault membership and permissions
- Roles:
  - owner: Full control (delete vault, manage members, full CRUD on items)
  - editor: Can add/edit/delete items
  - viewer: Read-only access`

## 4.5 vault_key_shares (Join Table)

`textvault_key_shares
------------------------------------
PK,FK  vault_id       BIGINT NOT NULL → vaults.vault_id
PK,FK  user_id        BIGINT NOT NULL → users.user_id
       enc_vault_key  TEXT NOT NULL   [Future: BLOB for wrapped encryption key]

Composite PK: (vault_id, user_id)

Notes:
- For future end-to-end encryption
- Each member gets their own wrapped copy of the vault's encryption key
- Matches vault_members structure but for cryptographic key sharing`

## 4.6 audit_logs

`textaudit_logs
------------------------------------
PK  log_id         BIGINT AUTO_INCREMENT
FK  user_id        BIGINT NOT NULL → users.user_id
FK  item_id        BIGINT → vault_items.item_id   [NULLABLE]
    action         VARCHAR(40) NOT NULL
    at             DATETIME DEFAULT CURRENT_TIMESTAMP
    ip             VARCHAR(45)
    meta           TEXT                [JSON: old/new values, extra details]

Notes:
- Records all user actions for security/compliance
- item_id is NULL for non-item actions (login, vault operations, member changes)
- action examples: "create", "update", "delete", "view", "login", "add_member"
- meta: JSON field for flexible audit data storage`

## Relationships Summary

- User (1) → Vaults (0..*)
- Vault (1) → VaultItems (0..*)
- User (*) ↔ Vault (*) via VaultMember
- User (*) ↔ Vault (*) via VaultKeyShare
- User (1) → AuditLogs (0..*)
- VaultItem (0..1) → AuditLogs (0..*)

---

## 5. SQL DDL (Database Creation Code)

`sql*-- USERS*
CREATE TABLE users (
    user_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    email          VARCHAR(255) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    kdf            VARCHAR(24),
    kdf_params     TEXT,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME ON UPDATE CURRENT_TIMESTAMP
);

*-- VAULTS*
CREATE TABLE vaults (
    vault_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id        BIGINT NOT NULL,
    name           VARCHAR(100) NOT NULL,
    key_version    INT DEFAULT 1,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

*-- VAULT_ITEMS*
CREATE TABLE vault_items (
    item_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    vault_id       BIGINT NOT NULL,
    title          VARCHAR(100),
    type           VARCHAR(16),
    enc_payload    TEXT,
    enc_iv         VARCHAR(32),
    enc_tag        VARCHAR(32),
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vault_id) REFERENCES vaults(vault_id)
);

*-- VAULT_MEMBERS (many-to-many, composite PK)*
CREATE TABLE vault_members (
    vault_id       BIGINT NOT NULL,
    user_id        BIGINT NOT NULL,
    role           ENUM('owner','editor','viewer')
    added_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (vault_id, user_id),
    FOREIGN KEY (vault_id) REFERENCES vaults(vault_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

*-- VAULT_KEY_SHARES (many-to-many, composite PK, crypto)*
CREATE TABLE vault_key_shares (
    vault_id       BIGINT NOT NULL,
    user_id        BIGINT NOT NULL,
    enc_vault_key  TEXT NOT NULL,
    PRIMARY KEY (vault_id, user_id),
    FOREIGN KEY (vault_id) REFERENCES vaults(vault_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

*-- AUDIT_LOGS*
CREATE TABLE audit_logs (
    log_id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id        BIGINT NOT NULL,
    item_id        BIGINT,
    action         VARCHAR(40) NOT NULL,
    at             DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip             VARCHAR(45),
    meta           TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (item_id) REFERENCES vault_items(item_id)
);

*-- Recommended Indexes*
CREATE INDEX idx_vault_items_vaultid ON vault_items(vault_id);
CREATE INDEX idx_vault_items_title ON vault_items(title);
CREATE INDEX idx_audit_logs_userid ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_itemid ON audit_logs(item_id);`

---

## 6. CLASS DIAGRAM (Entity Classes)

## 6.1 User

```sql
Class: User
-------------------------
- userId: Long
- email: String
- passwordHash: String
- kdf: String         // For future encryption support
- kdfParams: String   // JSON for future KDF details
- createdAt: LocalDateTime
- updatedAt: LocalDateTime
Methods:
+ registerUser(email, password): User
+ authenticateUser(email, password): User
+ changePassword(userId, oldPassword, newPassword): boolean
+ deleteUser(userId): void
+ getUserByEmail(email): User
+ existsByEmail(email): boolean
+ updateProfile(userId, ...): User
+ getUserId(): Long
+ getEmail(): String
+ setEmail(email: String): void
+ getPasswordHash(): String
+ setPasswordHash(hash: String): void
+ ... // Standard getters/setter
```

## 6.2 Vault

```sql
Class: Vault
-------------------------
- vaultId: Long
- userId: Long
- name: String
- keyVersion: int
- createdAt: LocalDateTime
Methods:
+ createVault(userId, name): Vault
+ getVault(vaultId): Vault
+ updateVault(vaultId, name, keyVersion): Vault
+ deleteVault(vaultId): void
+ addVaultMember(vaultId, userId, role): VaultMember
+ removeVaultMember(vaultId, userId): void
+ listVaultMembers(vaultId): List<VaultMember>
+ changeVaultOwner(vaultId, newOwnerId): void
+ rotateVaultKey(vaultId): void
+ getVaultId(): Long
+ getUserId(): Long
+ ... // Standard getters/setters
```

## 6.3 VaultItem

```sql
Class: VaultItem
-------------------------
- itemId: Long
- vaultId: Long
- title: String
- type: String    // [login, secure_note, card]
- encPayload: String  // Plaintext for MVP, encrypted for future
- encIv: String
- encTag: String
- createdAt: LocalDateTime
- updatedAt: LocalDateTime
Methods:
+ addItem(vaultId, ...): VaultItem
+ getItem(itemId): VaultItem
+ updateItem(itemId, ...): VaultItem
+ deleteItem(itemId): void
+ listVaultItems(vaultId): List<VaultItem>
+ searchItems(vaultId, query): List<VaultItem>
+ encryptItem(itemId, ...): void
+ decryptItem(itemId, ...): void
+ ... // Standard getters/setters
```

## 6.4 VaultMember

```sql
Class: VaultMember
-------------------------
- vaultId: Long
- userId: Long
- role: String    // owner, editor, viewer
- addedAt: LocalDateTime
Methods:
+ getMember(vaultId, userId): VaultMember
+ updateMemberRole(vaultId, userId, newRole): VaultMember
+ isUserInVault(vaultId, userId): boolean
+ getUserVaults(userId): List<Vault>
+ ... // Standard getters/setter
```

## 6.5 VaultKeyShare

```sql
Class: VaultKeyShare
-------------------------
- vaultId: Long
- userId: Long
- encVaultKey: String   // For future per-user key encryption
Methods:
+ addKeyShare(vaultId, userId, encVaultKey): VaultKeyShare
+ getKeyShare(vaultId, userId): VaultKeyShare
+ updateKeyShare(vaultId, userId, newEncVaultKey): VaultKeyShare
+ removeKeyShare(vaultId, userId): void
+ ... // Standard getters/setters
```

## 6.6 AuditLog

```sql
Class: AuditLog
-------------------------
- logId: Long
- userId: Long
- itemId: Long        // nullable
- action: String
- at: LocalDateTime
- ip: String
- meta: String        // JSON
Methods:
+ logAction(userId, itemId, action, meta): AuditLog
+ getAuditLogsByUser(userId): List<AuditLog>
+ getAuditLogsByVault(vaultId): List<AuditLog>
+ getAuditLogsByItem(itemId): List<AuditLog>
+ searchAuditLogs(criteria): List<AuditLog>
+ ... // Standard getters/setters
```

## Class Relationships

- All relationships are **associations**
- User (1) — Vault (0..*)
- Vault (1) — VaultItem (0..*)
- User (0..*) — Vault (0..*) via VaultMember, VaultKeyShare
- AuditLog references User (always), VaultItem (optionally)

---

## 7. BACKEND ARCHITECTURE (Spring Boot)

## 7.1 Package Structure

`textcom.vaultogether
├── entity          // JPA entities (User, Vault, VaultItem, etc.)
├── repository      // Spring Data JPA repositories
├── service         // Business logic
├── controller      // REST API endpoints
├── dto             // Data Transfer Objects (request/response)
├── security        // Security configuration, auth
├── exception       // Custom exceptions, error handling
└── config          // Application configuration`

## 7.2 REST API Endpoints

## Users

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Authenticate user
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `DELETE /api/users/me` - Delete account

## Vaults

- `POST /api/vaults` - Create vault
- `GET /api/vaults` - List user's vaults
- `GET /api/vaults/{id}` - Get vault by ID
- `PUT /api/vaults/{id}` - Update vault
- `DELETE /api/vaults/{id}` - Delete vault

## Vault Items

- `POST /api/vaults/{vaultId}/items` - Add item to vault
- `GET /api/vaults/{vaultId}/items` - List vault items
- `GET /api/vault-items/{id}` - Get item by ID
- `PUT /api/vault-items/{id}` - Update item
- `DELETE /api/vault-items/{id}` - Delete item

## Vault Members

- `POST /api/vaults/{vaultId}/members` - Add member to vault
- `GET /api/vaults/{vaultId}/members` - List vault members
- `PUT /api/vaults/{vaultId}/members/{userId}` - Update member role
- `DELETE /api/vaults/{vaultId}/members/{userId}` - Remove member

## Audit Logs

- `GET /api/audit-logs` - List user's audit logs
- `GET /api/vaults/{vaultId}/audit-logs` - Vault-specific logs
- `GET /api/vault-items/{itemId}/audit-logs` - Item-specific logs

## 7.3 Service Layer Responsibilities

- **UserService:** Registration, authentication, profile management
- **VaultService:** Vault CRUD, ownership validation
- **VaultItemService:** Item CRUD, vault membership validation
- **VaultMemberService:** Member management, role enforcement
- **AuditLogService:** Log all actions, query logs
- **VaultKeyShareService:** (Future) Key distribution

## 7.4 Security Rules

- Users can only access their own data
- Vault access based on membership role
- Owner can manage members and delete vault
- Editor can CRUD items
- Viewer can only read
- All passwords hashed with BCrypt (minimum)
- SQL injection prevention via JPA (no raw SQL)

---

## 8. FRONTEND ARCHITECTURE (React)

## 8.1 Component Structure

`textsrc/
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── vaults/
│   │   ├── VaultList.jsx
│   │   ├── VaultCard.jsx
│   │   ├── VaultForm.jsx
│   │   └── VaultDetail.jsx
│   ├── items/
│   │   ├── ItemList.jsx
│   │   ├── ItemCard.jsx
│   │   └── ItemForm.jsx
│   ├── members/
│   │   ├── MemberList.jsx
│   │   └── MemberForm.jsx
│   └── audit/
│       └── AuditLogTable.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   └── VaultDetailPage.jsx
├── services/
│   └── api.js           // Axios/Fetch wrapper
├── hooks/
│   ├── useAuth.js
│   ├── useVaults.js
│   └── useVaultItems.js
└── App.jsx`

## 8.2 Key User Flows

1. **Registration/Login** → Dashboard
2. **Dashboard** → View all vaults → Select vault
3. **Vault Detail** → View items, members, audit logs
4. **Add Item** → Form → API call → Refresh list
5. **Share Vault** → Add member with role → Update member list
6. **View Audit Logs** → Table view with filters

---

## 9. DEVELOPMENT WORKFLOW

## Phase 1: Setup (Week 1)

- Initialize Git repositories
- Bootstrap Spring Boot project
- Set up MariaDB, create schema
- Bootstrap React project
- Configure development environment

## Phase 2: Backend Core (Week 2-3)

- Implement JPA entities
- Create repositories
- Build service layer with CRUD
- Implement REST controllers
- Test with Postman

## Phase 3: Security (Week 3)

- Add Spring Security
- Implement authentication
- Add password hashing
- Enforce access control

## Phase 4: Frontend (Week 4-5)

- Build auth pages
- Create dashboard
- Implement vault management UI
- Add item CRUD forms
- Connect to backend APIs

## Phase 5: Integration & Testing (Week 5-6)

- End-to-end testing
- Bug fixes
- Performance optimization
- Documentation updates

## Phase 6: Polish & Submission (Week 6-7)

- Code cleanup and comments
- README completion
- Diagram finalization
- Presentation preparation

---

## 10. TESTING STRATEGY

## Unit Tests

- Repository layer (JPA queries)
- Service layer (business logic)
- Test with JUnit 5, Mockito

## Integration Tests

- API endpoints with MockMvc
- Database integration with @DataJpaTest

## Manual Testing

- Postman collections for all endpoints
- Frontend user flow testing
- Edge case testing (permissions, validation)

---

## 11. CAPSTONE REQUIREMENTS COMPLIANCE

## Technical Requirements ✓

- React JS frontend ✓
- Spring Boot backend ✓
- RESTful web services ✓
- MariaDB database ✓
- Minimum 3 tables (have 6) ✓
- Spring Data JPA (no raw SQL) ✓
- Proper OOP design ✓
- SQL injection prevention (via JPA) ✓

## Documentation Requirements ✓

- ER diagram (Crow's Foot notation) ✓
- Class diagram with attributes/methods ✓
- Well-commented code ✓
- README with startup instructions ✓

## Deliverables ✓

- Milestone 1: Proposal, wireframes, diagrams
- Milestone 2: Backend code, DB schema
- Milestone 3: Complete source code
- Milestone 4: 15-minute presentation

---

## 12. FUTURE ENHANCEMENTS ROADMAP

## Security Improvements

- End-to-end encryption (AES-GCM)
- Key derivation with Argon2id
- Per-user key wrapping
- Key rotation support
- Multi-factor authentication
- Session management improvements

## Features

- Password strength checker
- Password generator
- Vault templates
- Import/export (CSV, JSON)
- Browser extension
- Mobile app
- Sharing via email invitation
- Expiring share links
- Password history tracking

## Technical Improvements

- Caching (Redis)
- Rate limiting
- WebSocket for real-time updates
- Comprehensive logging
- Monitoring/alerting
- CI/CD pipeline
- Docker containerization

---

## 13. KNOWN LIMITATIONS (MVP)

- Passwords/items stored in plaintext initially (marked for future encryption)
- Basic authentication only (no OAuth, MFA)
- No email notifications
- Limited role enforcement in MVP
- No password recovery mechanism
- Single-server deployment (no HA/DR)

---

## 14. SUCCESS CRITERIA

## Functional

- Users can register, login, logout
- Users can create, read, update, delete vaults
- Users can add, view, edit, delete items in vaults
- Users can share vaults with other users
- All actions are logged in audit_logs
- Role-based access works correctly

## Technical

- All CRUD operations work via REST API
- Frontend communicates with backend successfully
- Data persists correctly in MariaDB
- No SQL injection vulnerabilities
- Code is well-organized and commented

## Academic

- Meets all capstone requirements
- Complete documentation
- Working demo for presentation
- Shows understanding of full-stack development

---

## 15. CONTACT & REPOSITORY INFO

**Developer:** [Your Name]

**Course:** CET3049 - Modern Full Stack Development with Java

**Institution:** [Your Institution]

**Academic Year:** 2025

**Repositories:**

- Backend: [GitHub URL]
- Frontend: [GitHub URL]

---

## 16. QUICK REFERENCE

## Start Backend

`bashcd vaultogether-backend
./mvnw spring-boot:run
*# Runs on http://localhost:8080*`

## Start Frontend

`bashcd vaultogether-frontend
npm start
*# Runs on http://localhost:3000*`

## Database Setup

`bash*# In DBeaver or MySQL CLI:*
CREATE DATABASE vaultogether;
USE vaultogether;
*# Run SQL DDL from section 5*`

## Test User (After Registration)

`textEmail: test@example.com
Password: Test123!`

---

**END OF COMPREHENSIVE PROJECT SPECIFICATION**
