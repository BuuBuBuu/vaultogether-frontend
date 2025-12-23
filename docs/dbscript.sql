DROP DATABASE IF EXISTS vaultogether;
CREATE DATABASE vaultogether;
USE vaultogether;

-- USERS
CREATE TABLE users (
    user_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    email          VARCHAR(255) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    kdf            VARCHAR(24),
    kdf_params     TEXT,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- VAULTS
CREATE TABLE vaults (
    vault_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id        BIGINT NOT NULL,
    name           VARCHAR(100) NOT NULL,
    description    VARCHAR(255),
    key_version    INT DEFAULT 1,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- VAULT_ITEMS
CREATE TABLE vault_items (
    item_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    vault_id       BIGINT NOT NULL,
    title          VARCHAR(100),
    type           VARCHAR(16),
    enc_payload    TEXT,
    enc_iv         VARCHAR(32),
    enc_tag        VARCHAR(32),
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vault_id) REFERENCES vaults(vault_id) ON DELETE CASCADE
);

-- VAULT_MEMBERS
CREATE TABLE vault_members (
    vault_id       BIGINT NOT NULL,
    user_id        BIGINT NOT NULL,
    role           ENUM('OWNER','EDITOR','VIEWER'),
    added_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (vault_id, user_id),
    FOREIGN KEY (vault_id) REFERENCES vaults(vault_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- VAULT_KEY_SHARES
CREATE TABLE vault_key_shares (
    vault_id       BIGINT NOT NULL,
    user_id        BIGINT NOT NULL,
    enc_vault_key  TEXT NOT NULL,
    PRIMARY KEY (vault_id, user_id),
    FOREIGN KEY (vault_id) REFERENCES vaults(vault_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- AUDIT_LOGS
CREATE TABLE audit_logs (
    log_id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id        BIGINT NOT NULL,
    item_id        BIGINT,
    item_name      VARCHAR(100),
    action         VARCHAR(40) NOT NULL,
    `at`           DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip             VARCHAR(45),
    meta           TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- INDEXES
CREATE INDEX idx_vault_items_title ON vault_items(title);
