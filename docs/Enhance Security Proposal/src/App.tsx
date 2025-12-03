import { useState } from 'react';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { Eye, EyeOff, Lock, KeyRound } from 'lucide-react';
import { PasswordGenerator } from './components/PasswordGenerator';

export default function App() {
  const [view, setView] = useState<'auth' | 'generator'>('auth');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${mode} submitted:`, formData);
    // Mock authentication logic
    alert(`${mode === 'login' ? 'Login' : 'Registration'} successful! (Demo mode)`);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const switchMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setFormData({ username: '', password: '', confirmPassword: '' });
    setShowPassword(false);
  };

  if (view === 'generator') {
    return <PasswordGenerator onBack={() => setView('auth')} />;
  }

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
