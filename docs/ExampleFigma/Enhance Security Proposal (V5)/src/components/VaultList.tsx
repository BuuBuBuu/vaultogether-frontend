import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, Lock, Users, Key, Trash2, Settings, LogOut, Shield } from 'lucide-react';
import { Vault } from '../types/vault';

interface VaultListProps {
  vaults: Vault[];
  onCreateVault: (name: string, description: string) => void;
  onDeleteVault: (id: string) => void;
  onSelectVault: (vault: Vault) => void;
  onManageMembers: (vault: Vault) => void;
  onLogout: () => void;
}

export function VaultList({
  vaults,
  onCreateVault,
  onDeleteVault,
  onSelectVault,
  onManageMembers,
  onLogout,
}: VaultListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newVault, setNewVault] = useState({ name: '', description: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVault.name.trim()) {
      onCreateVault(newVault.name, newVault.description);
      setNewVault({ name: '', description: '' });
      setShowCreateForm(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-black text-white';
      case 'editor':
        return 'bg-[#d9d9d9] text-black';
      case 'viewer':
        return 'bg-white border-2 border-[#d9d9d9] text-black';
      default:
        return 'bg-[#d9d9d9] text-black';
    }
  };

  return (
    <div className="size-full bg-white overflow-auto">
      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-[#d9d9d9]">
          <div className="flex items-center gap-3">
            <Lock className="w-8 h-8" />
            <div>
              <h1 className="font-['Fira_Mono',_monospace] text-[32px]">Vaultogether</h1>
              <p className="font-['Fira_Mono',_monospace] text-[13px] text-muted-foreground">
                Your secure password vaults
              </p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="h-[40px] border-2 border-[#d9d9d9] hover:border-black hover:bg-transparent font-['Fira_Mono',_monospace] text-[14px]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Create Vault Button/Form */}
        <div className="mb-8">
          {!showCreateForm ? (
            <Button
              onClick={() => setShowCreateForm(true)}
              className="w-full h-[50px] bg-[#d9d9d9] hover:bg-[#c5c5c5] text-black font-['Fira_Mono',_monospace] text-[15px] border-2 border-transparent hover:border-black transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Vault
            </Button>
          ) : (
            <form onSubmit={handleCreate} className="p-6 border-2 border-[#d9d9d9] rounded-md space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Fira_Mono',_monospace] text-[18px]">New Vault</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewVault({ name: '', description: '' });
                  }}
                  className="font-['Fira_Mono',_monospace] text-[13px] text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vaultName" className="font-['Fira_Mono',_monospace] text-[14px]">
                  Vault Name:
                </Label>
                <Input
                  id="vaultName"
                  type="text"
                  value={newVault.name}
                  onChange={(e) => setNewVault({ ...newVault, name: e.target.value })}
                  className="font-['Fira_Mono',_monospace] h-[40px] border-2 border-[#d9d9d9] focus:border-black"
                  placeholder="e.g., Personal, Work, Family"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vaultDescription" className="font-['Fira_Mono',_monospace] text-[14px]">
                  Description (optional):
                </Label>
                <Input
                  id="vaultDescription"
                  type="text"
                  value={newVault.description}
                  onChange={(e) => setNewVault({ ...newVault, description: e.target.value })}
                  className="font-['Fira_Mono',_monospace] h-[40px] border-2 border-[#d9d9d9] focus:border-black"
                  placeholder="What's stored in this vault?"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-[44px] bg-black hover:bg-[#333] text-white font-['Fira_Mono',_monospace] text-[14px]"
              >
                <Shield className="w-4 h-4 mr-2" />
                Create Vault
              </Button>
            </form>
          )}
        </div>

        {/* Vaults Grid */}
        {vaults.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-[#d9d9d9] rounded-md">
            <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="font-['Fira_Mono',_monospace] text-[15px] text-muted-foreground mb-2">
              No vaults yet
            </p>
            <p className="font-['Fira_Mono',_monospace] text-[12px] text-muted-foreground">
              Create your first vault to start storing passwords securely
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vaults.map((vault) => (
              <div
                key={vault.id}
                className="p-5 border-2 border-[#d9d9d9] rounded-md hover:border-black transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-['Fira_Mono',_monospace] text-[18px]">{vault.name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded font-['Fira_Mono',_monospace] text-[10px] uppercase ${getRoleBadgeColor(
                          vault.userRole
                        )}`}
                      >
                        {vault.userRole}
                      </span>
                    </div>
                    {vault.description && (
                      <p className="font-['Fira_Mono',_monospace] text-[12px] text-muted-foreground">
                        {vault.description}
                      </p>
                    )}
                  </div>
                  {vault.userRole === 'owner' && (
                    <button
                      onClick={() => onDeleteVault(vault.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#fee] rounded"
                      title="Delete vault"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4 font-['Fira_Mono',_monospace] text-[12px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Key className="w-3 h-3" />
                    <span>{vault.itemCount} items</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{vault.memberCount} members</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => onSelectVault(vault)}
                    className="flex-1 h-[38px] bg-[#d9d9d9] hover:bg-black hover:text-white text-black font-['Fira_Mono',_monospace] text-[13px] transition-all"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Open Vault
                  </Button>
                  <Button
                    onClick={() => onManageMembers(vault)}
                    variant="outline"
                    className="h-[38px] px-4 border-2 border-[#d9d9d9] hover:border-black hover:bg-transparent font-['Fira_Mono',_monospace] text-[13px]"
                    title="Manage members"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-8 p-4 border-2 border-[#d9d9d9] rounded-md">
          <p className="font-['Fira_Mono',_monospace] text-[11px] text-muted-foreground text-center leading-relaxed">
            🔒 All data encrypted with AES-GCM at rest<br />
            🔐 Zero-knowledge architecture<br />
            🛡️ Role-based access control for shared vaults
          </p>
        </div>
      </div>
    </div>
  );
}
