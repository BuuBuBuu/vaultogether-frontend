import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Plus, Eye, EyeOff, Copy, Check, Pencil, Trash2, ExternalLink, Key, Globe } from 'lucide-react';
import { Vault, VaultItem } from '../types/vault';
import { PasswordGenerator } from './PasswordGenerator';

interface VaultItemsProps {
  vault: Vault;
  items: VaultItem[];
  onBack: () => void;
  onCreateItem: (item: Omit<VaultItem, 'id' | 'vaultId' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateItem: (id: string, item: Partial<VaultItem>) => void;
  onDeleteItem: (id: string) => void;
}

export function VaultItems({ vault, items, onBack, onCreateItem, onUpdateItem, onDeleteItem }: VaultItemsProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: '',
  });
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const canEdit = vault.userRole === 'owner' || vault.userRole === 'editor';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateItem(editingId, formData);
    } else {
      onCreateItem(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', username: '', password: '', url: '', notes: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (item: VaultItem) => {
    setFormData({
      title: item.title,
      username: item.username,
      password: item.password,
      url: item.url || '',
      notes: item.notes || '',
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (showGenerator) {
    return (
      <PasswordGenerator
        onBack={() => setShowGenerator(false)}
      />
    );
  }

  return (
    <div className="size-full bg-white overflow-auto">
      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-[#d9d9d9]">
          <button
            onClick={onBack}
            className="p-2 hover:bg-[#f5f5f5] rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-['Fira_Mono',_monospace] text-[28px]">{vault.name}</h1>
            {vault.description && (
              <p className="font-['Fira_Mono',_monospace] text-[13px] text-muted-foreground">
                {vault.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-['Fira_Mono',_monospace] text-[12px] text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {/* Add Item Button/Form */}
        {canEdit && (
          <div className="mb-8">
            {!showForm ? (
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowForm(true)}
                  className="flex-1 h-[50px] bg-[#d9d9d9] hover:bg-[#c5c5c5] text-black font-['Fira_Mono',_monospace] text-[15px] border-2 border-transparent hover:border-black transition-all"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Password Item
                </Button>
                <Button
                  onClick={() => setShowGenerator(true)}
                  variant="outline"
                  className="h-[50px] px-6 border-2 border-[#d9d9d9] hover:border-black hover:bg-transparent font-['Fira_Mono',_monospace] text-[15px]"
                >
                  <Key className="w-5 h-5 mr-2" />
                  Generate Password
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 border-2 border-[#d9d9d9] rounded-md space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-['Fira_Mono',_monospace] text-[18px]">
                    {editingId ? 'Edit Item' : 'New Password Item'}
                  </h3>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="font-['Fira_Mono',_monospace] text-[13px] text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="title" className="font-['Fira_Mono',_monospace] text-[14px]">
                      Title / Service:
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="font-['Fira_Mono',_monospace] h-[40px] border-2 border-[#d9d9d9] focus:border-black"
                      placeholder="e.g., GitHub, Netflix, Gmail"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="font-['Fira_Mono',_monospace] text-[14px]">
                      Username / Email:
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="font-['Fira_Mono',_monospace] h-[40px] border-2 border-[#d9d9d9] focus:border-black"
                      placeholder="username or email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-['Fira_Mono',_monospace] text-[14px]">
                      Password:
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="password"
                        type="text"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="font-['Fira_Mono',_monospace] h-[40px] border-2 border-[#d9d9d9] focus:border-black flex-1"
                        placeholder="password"
                        required
                      />
                      <Button
                        type="button"
                        onClick={() => setShowGenerator(true)}
                        className="h-[40px] px-4 bg-[#d9d9d9] hover:bg-[#c5c5c5] text-black font-['Fira_Mono',_monospace] text-[12px]"
                      >
                        <Key className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="url" className="font-['Fira_Mono',_monospace] text-[14px]">
                      URL (optional):
                    </Label>
                    <Input
                      id="url"
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="font-['Fira_Mono',_monospace] h-[40px] border-2 border-[#d9d9d9] focus:border-black"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="notes" className="font-['Fira_Mono',_monospace] text-[14px]">
                      Notes (optional):
                    </Label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full font-['Fira_Mono',_monospace] p-3 border-2 border-[#d9d9d9] focus:border-black rounded-md resize-none focus:outline-none"
                      placeholder="Additional notes or recovery information"
                      rows={3}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-[44px] bg-black hover:bg-[#333] text-white font-['Fira_Mono',_monospace] text-[14px]"
                >
                  {editingId ? 'Update Item' : 'Save Item'}
                </Button>
              </form>
            )}
          </div>
        )}

        {/* Items List */}
        {items.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-[#d9d9d9] rounded-md">
            <Key className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="font-['Fira_Mono',_monospace] text-[15px] text-muted-foreground mb-2">
              No password items yet
            </p>
            <p className="font-['Fira_Mono',_monospace] text-[12px] text-muted-foreground">
              {canEdit ? 'Add your first password to this vault' : 'You need editor access to add items'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-5 border-2 border-[#d9d9d9] rounded-md hover:border-black transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-['Fira_Mono',_monospace] text-[16px]">{item.title}</h3>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          title="Open URL"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="font-['Fira_Mono',_monospace] text-[12px] text-muted-foreground">
                      {item.username}
                    </p>
                  </div>
                  {canEdit && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 hover:bg-[#f5f5f5] rounded transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this item?')) {
                            onDeleteItem(item.id);
                          }
                        }}
                        className="p-2 hover:bg-[#fee] rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {/* Password */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 font-['Fira_Mono',_monospace] text-[14px] bg-[#fafafa] px-3 py-2 rounded border border-[#e5e5e5]">
                      {visiblePasswords.has(item.id) ? item.password : '••••••••••••'}
                    </div>
                    <button
                      onClick={() => togglePasswordVisibility(item.id)}
                      className="p-2 hover:bg-[#f5f5f5] rounded transition-colors"
                      title={visiblePasswords.has(item.id) ? 'Hide password' : 'Show password'}
                    >
                      {visiblePasswords.has(item.id) ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(item.password, item.id)}
                      className="p-2 hover:bg-[#f5f5f5] rounded transition-colors"
                      title="Copy password"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Notes */}
                  {item.notes && (
                    <div className="pt-2 border-t border-[#e5e5e5]">
                      <p className="font-['Fira_Mono',_monospace] text-[11px] text-muted-foreground">
                        {item.notes}
                      </p>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center gap-3 pt-2 font-['Fira_Mono',_monospace] text-[10px] text-muted-foreground">
                    <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                    {item.updatedAt && item.updatedAt !== item.createdAt && (
                      <span>Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
