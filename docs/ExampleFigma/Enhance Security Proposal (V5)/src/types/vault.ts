export type UserRole = 'owner' | 'editor' | 'viewer';

export interface Vault {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  userRole: UserRole;
  itemCount: number;
  memberCount: number;
}

export interface VaultItem {
  id: string;
  vaultId: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VaultMember {
  id: string;
  vaultId: string;
  username: string;
  email: string;
  role: UserRole;
  addedAt: Date;
}
