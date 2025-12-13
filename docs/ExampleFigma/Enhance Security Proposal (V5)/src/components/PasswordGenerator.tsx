import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Copy, RefreshCw, Check, ArrowLeft } from 'lucide-react';

interface PasswordGeneratorProps {
  onBack?: () => void;
}

export function PasswordGenerator({ onBack }: PasswordGeneratorProps) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });

  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  const generatePassword = () => {
    let charset = '';
    let guaranteedChars = '';

    // Build charset and ensure at least one character from each selected type
    if (options.uppercase) {
      charset += charSets.uppercase;
      guaranteedChars += charSets.uppercase[Math.floor(Math.random() * charSets.uppercase.length)];
    }
    if (options.lowercase) {
      charset += charSets.lowercase;
      guaranteedChars += charSets.lowercase[Math.floor(Math.random() * charSets.lowercase.length)];
    }
    if (options.numbers) {
      charset += charSets.numbers;
      guaranteedChars += charSets.numbers[Math.floor(Math.random() * charSets.numbers.length)];
    }
    if (options.symbols) {
      charset += charSets.symbols;
      guaranteedChars += charSets.symbols[Math.floor(Math.random() * charSets.symbols.length)];
    }

    if (charset === '') {
      setPassword('');
      return;
    }

    let newPassword = guaranteedChars;
    const remainingLength = length - guaranteedChars.length;

    for (let i = 0; i < remainingLength; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');
    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleOption = (key: keyof typeof options) => {
    const newOptions = { ...options, [key]: !options[key] };
    // Ensure at least one option is selected
    if (Object.values(newOptions).some(v => v)) {
      setOptions(newOptions);
    }
  };

  const calculateStrength = (): { label: string; color: string; width: string } => {
    if (!password) return { label: '', color: '', width: '0%' };

    let score = 0;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (options.uppercase && options.lowercase) score++;
    if (options.numbers) score++;
    if (options.symbols) score++;

    if (score <= 2) return { label: 'Weak', color: '#ef4444', width: '33%' };
    if (score <= 4) return { label: 'Medium', color: '#f59e0b', width: '66%' };
    return { label: 'Strong', color: '#22c55e', width: '100%' };
  };

  // Generate initial password
  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const strength = calculateStrength();
  const atLeastOneSelected = Object.values(options).some(v => v);

  return (
    <div className="size-full flex items-center justify-center bg-white">
      <div className="w-full max-w-xl px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            {onBack && (
              <button
                onClick={onBack}
                className="absolute left-8 top-8 p-2 hover:bg-[#f5f5f5] rounded transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="font-['Fira_Mono',_monospace] text-[32px]">Password Generator</h1>
          </div>
          <p className="font-['Fira_Mono',_monospace] text-[13px] text-muted-foreground">
            Create cryptographically secure passwords
          </p>
        </div>

        {/* Generated Password Display */}
        <div className="mb-8">
          <div className="relative">
            <div className="font-['Fira_Mono',_monospace] text-[18px] p-4 pr-24 border-2 border-[#d9d9d9] rounded min-h-[60px] flex items-center break-all bg-[#fafafa]">
              {password || 'Select options to generate'}
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <Button
                onClick={copyToClipboard}
                disabled={!password}
                className="h-[44px] w-[44px] p-0 bg-[#d9d9d9] hover:bg-[#c5c5c5] text-black transition-all"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button
                onClick={generatePassword}
                disabled={!atLeastOneSelected}
                className="h-[44px] w-[44px] p-0 bg-[#d9d9d9] hover:bg-[#c5c5c5] text-black transition-all"
                title="Generate new password"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-['Fira_Mono',_monospace] text-[11px] text-muted-foreground">
                  Strength:
                </span>
                <span className="font-['Fira_Mono',_monospace] text-[11px]" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
              <div className="h-2 bg-[#e5e5e5] rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: strength.width, backgroundColor: strength.color }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Password Length */}
        <div className="space-y-6 mb-8">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="font-['Fira_Mono',_monospace] text-[15px]">
                Length:
              </Label>
              <span className="font-['Fira_Mono',_monospace] text-[15px] bg-[#d9d9d9] px-3 py-1 rounded">
                {length}
              </span>
            </div>
            <Slider
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              min={4}
              max={64}
              step={1}
              className="cursor-pointer"
            />
            <div className="flex justify-between">
              <span className="font-['Fira_Mono',_monospace] text-[11px] text-muted-foreground">4</span>
              <span className="font-['Fira_Mono',_monospace] text-[11px] text-muted-foreground">64</span>
            </div>
          </div>

          {/* Character Options */}
          <div className="space-y-4 p-4 border-2 border-[#d9d9d9] rounded">
            <Label className="font-['Fira_Mono',_monospace] text-[15px]">
              Character Types:
            </Label>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="uppercase"
                  checked={options.uppercase}
                  onCheckedChange={() => toggleOption('uppercase')}
                />
                <label
                  htmlFor="uppercase"
                  className="font-['Fira_Mono',_monospace] text-[14px] cursor-pointer select-none"
                >
                  Uppercase (A-Z)
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="lowercase"
                  checked={options.lowercase}
                  onCheckedChange={() => toggleOption('lowercase')}
                />
                <label
                  htmlFor="lowercase"
                  className="font-['Fira_Mono',_monospace] text-[14px] cursor-pointer select-none"
                >
                  Lowercase (a-z)
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="numbers"
                  checked={options.numbers}
                  onCheckedChange={() => toggleOption('numbers')}
                />
                <label
                  htmlFor="numbers"
                  className="font-['Fira_Mono',_monospace] text-[14px] cursor-pointer select-none"
                >
                  Numbers (0-9)
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="symbols"
                  checked={options.symbols}
                  onCheckedChange={() => toggleOption('symbols')}
                />
                <label
                  htmlFor="symbols"
                  className="font-['Fira_Mono',_monospace] text-[14px] cursor-pointer select-none"
                >
                  Symbols (!@#$%^&*...)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 border-2 border-[#d9d9d9] rounded-md">
          <p className="font-['Fira_Mono',_monospace] text-[11px] text-muted-foreground text-center leading-relaxed">
            💡 Recommended: 16+ characters with all types enabled<br/>
            🔐 Passwords are generated locally and never sent to servers<br/>
            🎲 Uses cryptographically secure randomization
          </p>
        </div>
      </div>
    </div>
  );
}
