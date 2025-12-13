import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Plus, Trash2, UserPlus, Crown, Edit2, Eye, Shield } from 'lucide-react';
import { Vault, VaultMember, UserRole } from '../types/vault';

interface VaultMembersProps {
  vault: Vault;
  members: VaultMember[];
  onBack: () => void;
  onAddMember: (username: string, email: string, role: UserRole) => void;
  onUpdateMemberRole: (id: string, role: UserRole) => void;
  onRemoveMember: (id: string) => void;
}

export function VaultMembers({
  vault,
  members,
  onBack,
  onAddMember,
  onUpdateMemberRole,
  onRemoveMember,
}: VaultMembersProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    username: '',
    email: '',
    role: 'viewer' as UserRole,
  });

  const isOwner = vault.userRole === 'owner';

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMember(newMember.username, newMember.email, newMember.role);
    setNewMember({ username: '', email: '', role: 'viewer' });
    setShowAddForm(false);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4" />;
      case 'editor':
        return <Edit2 className="w-4 h-4" />;
      case 'viewer':
        return <Eye className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return 'text-black';
      case 'editor':
        return 'text-blue-600';
      case 'viewer':
        return 'text-muted-foreground';
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return 'Full control, can manage members';
      case 'editor':
        return 'Can add, edit, and delete items';
      case 'viewer':
        return 'Can only view items';
    }
  };

  return (
    <div className="size-full bg-white overflow-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-[#d9d9d9]">
          <button onClick={onBack} className="p-2 hover:bg-[#f5f5f5] rounded transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-['Fira_Mono',_monospace] text-[28px]">Vault Members</h1>
            <p className="font-['Fira_Mono',_monospace] text-[13px] text-muted-foreground">
              {vault.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-['Fira_Mono',_monospace] text-[12px] text-muted-foreground">
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </span>
          </div>
        </div>

        {/* Role Legend */}
        <div className="mb-6 p-4 border-2 border-[#d9d9d9] rounded-md bg-[#fafafa]">
          <p className="font-['Fira_Mono',_monospace] text-[13px] mb-3">Access Levels:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(['owner', 'editor', 'viewer'] as UserRole[]).map((role) => (
              <div key={role} className="flex items-start gap-2">
                <div className={`mt-0.5 ${getRoleColor(role)}`}>{getRoleIcon(role)}</div>
                <div>
                  <p className="font-['Fira_Mono',_monospace] text-[12px] capitalize">{role}</p>
                  <p className="font-['Fira_Mono',_monospace] text-[10px] text-muted-foreground">
                    {getRoleDescription(role)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Member Button/Form */}
        {isOwner && (
          <div className="mb-8">
            {!showAddForm ? (
              <Button
                onClick={() => setShowAddForm(true)}
                className="w-full h-[50px] bg-[#d9d9d9] hover:bg-[#c5c5c5] text-black font-['Fira_Mono',_monospace] text-[15px] border-2 border-transparent hover:border-black transition-all"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Add Member
              </Button>
            ) : (
              <form onSubmit={handleAddMember} className="p-6 border-2 border-[#d9d9d9] rounded-md space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-['Fira_Mono',_monospace] text-[18px]">Add Member</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewMember({ username: '', email: '', role: 'viewer' });
                    }}
                    className="font-['Fira_Mono',_monospace] text-[13px] text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="font-['Fira_Mono',_monospace] text-[14px]">
                      Username:
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={newMember.username}
                      onChange={(e) => setNewMember({ ...newMember, username: e.target.value })}
                      className="font-['Fira_Mono',_monospace] h-[40px] border-2 border-[#d9d9d9] focus:border-black"
                      placeholder="username"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-['Fira_Mono',_monospace] text-[14px]">
                      Email:
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      className="font-['Fira_Mono',_monospace] h-[40px] border-2 border-[#d9d9d9] focus:border-black"
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label className="font-['Fira_Mono',_monospace] text-[14px]">Access Level:</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['viewer', 'editor', 'owner'] as UserRole[]).map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setNewMember({ ...newMember, role })}
                          className={`p-3 border-2 rounded-md transition-all font-['Fira_Mono',_monospace] text-[13px] ${
                            newMember.role === role
                              ? 'border-black bg-black text-white'
                              : 'border-[#d9d9d9] hover:border-black'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            {getRoleIcon(role)}
                            <span className="capitalize">{role}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-[44px] bg-black hover:bg-[#333] text-white font-['Fira_Mono',_monospace] text-[14px]"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </form>
            )}
          </div>
        )}

        {/* Members List */}
        {members.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-[#d9d9d9] rounded-md">
            <UserPlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="font-['Fira_Mono',_monospace] text-[15px] text-muted-foreground mb-2">
              No members yet
            </p>
            <p className="font-['Fira_Mono',_monospace] text-[12px] text-muted-foreground">
              {isOwner ? 'Add members to share this vault' : 'Only vault owners can add members'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => {
              const isCurrentOwner = member.role === 'owner';
              const canModify = isOwner && !isCurrentOwner;

              return (
                <div
                  key={member.id}
                  className="p-5 border-2 border-[#d9d9d9] rounded-md hover:border-black transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 bg-[#f5f5f5] rounded ${getRoleColor(member.role)}`}>
                        {getRoleIcon(member.role)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-['Fira_Mono',_monospace] text-[15px]">{member.username}</p>
                          <span
                            className={`px-2 py-0.5 rounded font-['Fira_Mono',_monospace] text-[10px] capitalize ${
                              member.role === 'owner'
                                ? 'bg-black text-white'
                                : member.role === 'editor'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-[#d9d9d9] text-black'
                            }`}
                          >
                            {member.role}
                          </span>
                        </div>
                        <p className="font-['Fira_Mono',_monospace] text-[12px] text-muted-foreground">
                          {member.email}
                        </p>
                        <p className="font-['Fira_Mono',_monospace] text-[10px] text-muted-foreground mt-1">
                          Added: {new Date(member.addedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Role Change & Remove Buttons */}
                    <div className="flex items-center gap-2">
                      {canModify && (
                        <>
                          <select
                            value={member.role}
                            onChange={(e) => onUpdateMemberRole(member.id, e.target.value as UserRole)}
                            className="font-['Fira_Mono',_monospace] text-[12px] px-3 py-2 border-2 border-[#d9d9d9] rounded hover:border-black focus:border-black focus:outline-none cursor-pointer"
                          >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                            <option value="owner">Owner</option>
                          </select>
                          <button
                            onClick={() => {
                              if (confirm(`Remove ${member.username} from this vault?`)) {
                                onRemoveMember(member.id);
                              }
                            }}
                            className="p-2 hover:bg-[#fee] rounded transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove member"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </>
                      )}
                      {isCurrentOwner && (
                        <div className="px-3 py-2 font-['Fira_Mono',_monospace] text-[11px] text-muted-foreground">
                          Cannot modify owner
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-8 p-4 border-2 border-[#d9d9d9] rounded-md">
          <p className="font-['Fira_Mono',_monospace] text-[11px] text-muted-foreground text-center leading-relaxed">
            🔐 Role-based access control ensures proper permissions<br />
            👥 Members can only access what their role allows<br />
            🛡️ Vault owners have full administrative control
          </p>
        </div>
      </div>
    </div>
  );
}
