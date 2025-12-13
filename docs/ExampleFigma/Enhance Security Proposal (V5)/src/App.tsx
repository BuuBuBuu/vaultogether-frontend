import { useState } from 'react';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Eye, EyeOff, Lock, KeyRound } from 'lucide-react';
import { PasswordGenerator } from './components/PasswordGenerator';
import { VaultList } from './components/VaultList';
import { VaultItems } from './components/VaultItems';
import { VaultMembers } from './components/VaultMembers';
import { Vault, VaultItem, VaultMember, UserRole } from './types/vault';

type View = 'auth' | 'generator' | 'vaultList' | 'vaultItems' | 'vaultMembers';

export default function App() {
  const [view, setView] = useState<View>('auth');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser] = useState('demo_user');

  // Vault Management State
  const [vaults, setVaults] = useState<Vault[]>([
    {
      id: '1',
      name: 'Personal',
      description: 'Personal accounts and passwords',
      createdAt: new Date('2024-01-15'),
      userRole: 'owner',
      itemCount: 3,
      memberCount: 1,
    },
    {
      id: '2',
      name: 'Work',
      description: 'Work-related credentials',
      createdAt: new Date('2024-02-01'),
      userRole: 'owner',
      itemCount: 2,
      memberCount: 2,
    },
    {
      id: '3',
      name: 'Family Shared',
      description: 'Shared family accounts',
      createdAt: new Date('2024-02-10'),
      userRole: 'editor',
      itemCount: 1,
      memberCount: 3,
    },
  ]);

  const [vaultItems, setVaultItems] = useState<VaultItem[]>([
    {
      id: 'item1',
      vaultId: '1',
      title: 'GitHub',
      username: 'demo_user',
      password: 'ghp_demo123456789',
      url: 'https://github.com',
      notes: 'Primary account',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: 'item2',
      vaultId: '1',
      title: 'Gmail',
      username: 'demo@example.com',
      password: 'SecurePass123!',
      url: 'https://mail.google.com',
      createdAt: new Date('2024-01-21'),
      updatedAt: new Date('2024-01-21'),
    },
    {
      id: 'item3',
      vaultId: '1',
      title: 'Netflix',
      username: 'demo@example.com',
      password: 'NetflixSecure456!',
      url: 'https://netflix.com',
      notes: 'Premium plan',
      createdAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-01-22'),
    },
    {
      id: 'item4',
      vaultId: '2',
      title: 'Slack',
      username: 'demo@company.com',
      password: 'SlackWork789!',
      url: 'https://company.slack.com',
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-02-05'),
    },
    {
      id: 'item5',
      vaultId: '2',
      title: 'Jira',
      username: 'demo@company.com',
      password: 'JiraSecure012!',
      url: 'https://company.atlassian.net',
      createdAt: new Date('2024-02-06'),
      updatedAt: new Date('2024-02-06'),
    },
    {
      id: 'item6',
      vaultId: '3',
      title: 'Disney+',
      username: 'family@example.com',
      password: 'DisneyFamily345!',
      url: 'https://disneyplus.com',
      notes: 'Family subscription',
      createdAt: new Date('2024-02-12'),
      updatedAt: new Date('2024-02-12'),
    },
  ]);

  const [vaultMembers, setVaultMembers] = useState<VaultMember[]>([
    {
      id: 'mem1',
      vaultId: '1',
      username: 'demo_user',
      email: 'demo@example.com',
      role: 'owner',
      addedAt: new Date('2024-01-15'),
    },
    {
      id: 'mem2',
      vaultId: '2',
      username: 'demo_user',
      email: 'demo@example.com',
      role: 'owner',
      addedAt: new Date('2024-02-01'),
    },
    {
      id: 'mem3',
      vaultId: '2',
      username: 'colleague_1',
      email: 'colleague@company.com',
      role: 'editor',
      addedAt: new Date('2024-02-02'),
    },
    {
      id: 'mem4',
      vaultId: '3',
      username: 'family_member',
      email: 'family@example.com',
      role: 'owner',
      addedAt: new Date('2024-02-10'),
    },
    {
      id: 'mem5',
      vaultId: '3',
      username: 'demo_user',
      email: 'demo@example.com',
      role: 'editor',
      addedAt: new Date('2024-02-11'),
    },
    {
      id: 'mem6',
      vaultId: '3',
      username: 'family_viewer',
      email: 'viewer@example.com',
      role: 'viewer',
      addedAt: new Date('2024-02-11'),
    },
  ]);

  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${mode} submitted:`, formData);
    // Mock authentication logic
    setIsAuthenticated(true);
    setView('vaultList');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const switchMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setFormData({ username: '', password: '', confirmPassword: '' });
    setShowPassword(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('auth');
    setSelectedVault(null);
  };

  // Vault CRUD Operations
  const handleCreateVault = (name: string, description: string) => {
    const newVault: Vault = {
      id: `vault_${Date.now()}`,
      name,
      description,
      createdAt: new Date(),
      userRole: 'owner',
      itemCount: 0,
      memberCount: 1,
    };
    setVaults((prev) => [...prev, newVault]);

    // Add creator as owner member
    const newMember: VaultMember = {
      id: `mem_${Date.now()}`,
      vaultId: newVault.id,
      username: currentUser,
      email: `${currentUser}@example.com`,
      role: 'owner',
      addedAt: new Date(),
    };
    setVaultMembers((prev) => [...prev, newMember]);
  };

  const handleDeleteVault = (id: string) => {
    if (confirm('Are you sure you want to delete this vault? All items and members will be removed.')) {
      setVaults((prev) => prev.filter((v) => v.id !== id));
      setVaultItems((prev) => prev.filter((item) => item.vaultId !== id));
      setVaultMembers((prev) => prev.filter((member) => member.vaultId !== id));
    }
  };

  const handleSelectVault = (vault: Vault) => {
    setSelectedVault(vault);
    setView('vaultItems');
  };

  const handleManageMembers = (vault: Vault) => {
    setSelectedVault(vault);
    setView('vaultMembers');
  };

  // Vault Item CRUD Operations
  const handleCreateItem = (item: Omit<VaultItem, 'id' | 'vaultId' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedVault) return;

    const newItem: VaultItem = {
      ...item,
      id: `item_${Date.now()}`,
      vaultId: selectedVault.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setVaultItems((prev) => [...prev, newItem]);

    // Update item count
    setVaults((prev) =>
      prev.map((v) => (v.id === selectedVault.id ? { ...v, itemCount: v.itemCount + 1 } : v))
    );
  };

  const handleUpdateItem = (id: string, updates: Partial<VaultItem>) => {
    setVaultItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    if (!selectedVault) return;

    setVaultItems((prev) => prev.filter((item) => item.id !== id));

    // Update item count
    setVaults((prev) =>
      prev.map((v) => (v.id === selectedVault.id ? { ...v, itemCount: Math.max(0, v.itemCount - 1) } : v))
    );
  };

  // Vault Member CRUD Operations
  const handleAddMember = (username: string, email: string, role: UserRole) => {
    if (!selectedVault) return;

    const newMember: VaultMember = {
      id: `mem_${Date.now()}`,
      vaultId: selectedVault.id,
      username,
      email,
      role,
      addedAt: new Date(),
    };
    setVaultMembers((prev) => [...prev, newMember]);

    // Update member count
    setVaults((prev) =>
      prev.map((v) => (v.id === selectedVault.id ? { ...v, memberCount: v.memberCount + 1 } : v))
    );
  };

  const handleUpdateMemberRole = (id: string, role: UserRole) => {
    setVaultMembers((prev) =>
      prev.map((member) => (member.id === id ? { ...member, role } : member))
    );
  };

  const handleRemoveMember = (id: string) => {
    if (!selectedVault) return;

    setVaultMembers((prev) => prev.filter((member) => member.id !== id));

    // Update member count
    setVaults((prev) =>
      prev.map((v) =>
        v.id === selectedVault.id ? { ...v, memberCount: Math.max(1, v.memberCount - 1) } : v
      )
    );
  };

  // Render different views
  if (view === 'generator') {
    return <PasswordGenerator onBack={() => setView(isAuthenticated ? 'vaultList' : 'auth')} />;
  }

  if (view === 'vaultList' && isAuthenticated) {
    return (
      <VaultList
        vaults={vaults}
        onCreateVault={handleCreateVault}
        onDeleteVault={handleDeleteVault}
        onSelectVault={handleSelectVault}
        onManageMembers={handleManageMembers}
        onLogout={handleLogout}
      />
    );
  }

  if (view === 'vaultItems' && selectedVault) {
    const items = vaultItems.filter((item) => item.vaultId === selectedVault.id);
    return (
      <VaultItems
        vault={selectedVault}
        items={items}
        onBack={() => setView('vaultList')}
        onCreateItem={handleCreateItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
      />
    );
  }

  if (view === 'vaultMembers' && selectedVault) {
    const members = vaultMembers.filter((member) => member.vaultId === selectedVault.id);
    return (
      <VaultMembers
        vault={selectedVault}
        members={members}
        onBack={() => setView('vaultList')}
        onAddMember={handleAddMember}
        onUpdateMemberRole={handleUpdateMemberRole}
        onRemoveMember={handleRemoveMember}
      />
    );
  }

  // Auth view (login/register)
  return (
    <div className="size-full flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Lock className="w-8 h-8" />
            <h1 className="font-['Fira_Mono',_monospace] text-[40px]">Vaultogether</h1>
          </div>
          <p className="font-['Fira_Mono',_monospace] text-[13px] text-muted-foreground">
            {mode === 'login' ? 'Secure password management' : 'Create your secure vault'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="username" 
              className="font-['Fira_Mono',_monospace] text-[15px]"
            >
              Username:
            </Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="font-['Fira_Mono',_monospace] h-[40px] border-2 border-[#d9d9d9] focus:border-black transition-colors"
              required
              autoComplete="username"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="password" 
              className="font-['Fira_Mono',_monospace] text-[15px]"
            >
              Password:
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="font-['Fira_Mono',_monospace] h-[40px] border-2 border-[#d9d9d9] focus:border-black transition-colors pr-10"
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Register only) */}
          {mode === 'register' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label 
                htmlFor="confirmPassword" 
                className="font-['Fira_Mono',_monospace] text-[15px]"
              >
                Confirm Password:
              </Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="font-['Fira_Mono',_monospace] h-[40px] border-2 border-[#d9d9d9] focus:border-black transition-colors"
                required={mode === 'register'}
                autoComplete="new-password"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              type="submit"
              className="w-full h-[44px] bg-[#d9d9d9] hover:bg-[#c5c5c5] text-black font-['Fira_Mono',_monospace] text-[15px] transition-all hover:scale-[1.02]"
            >
              {mode === 'login' ? 'Login' : 'Register'}
            </Button>
            
            <Button
              type="button"
              onClick={switchMode}
              variant="outline"
              className="w-full h-[44px] border-2 border-[#d9d9d9] hover:border-black hover:bg-transparent text-black font-['Fira_Mono',_monospace] text-[15px] transition-all"
            >
              {mode === 'login' ? 'Create Account' : 'Back to Login'}
            </Button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-8 p-4 border-2 border-[#d9d9d9] rounded-md">
          <p className="font-['Fira_Mono',_monospace] text-[11px] text-muted-foreground text-center leading-relaxed">
            🔒 Secured with Argon2id password hashing<br/>
            🔐 AES-GCM encryption at rest<br/>
            🛡️ JWT-based stateless authentication
          </p>
        </div>

        {/* Password Generator Link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setView('generator')}
            className="font-['Fira_Mono',_monospace] text-[13px] text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 group"
          >
            <KeyRound className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="underline">Generate secure password</span>
          </button>
        </div>
      </div>
    </div>
  );
}