import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Mail, User, Globe } from 'lucide-react';

interface SettingsPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (settings: SettingsData) => void;
}

interface SettingsData {
  companyName: string;
  fromEmail: string;
  fromName: string;
  website: string;
}

export default function SettingsPopup({ open, onOpenChange, onSave }: SettingsPopupProps) {
  const [settings, setSettings] = useState<SettingsData>({
    companyName: 'Your Company',
    fromEmail: 'hello@company.com',
    fromName: 'Marketing Team',
    website: 'https://yourcompany.com',
  });

  const handleSave = () => {
    if (onSave) {
      onSave(settings);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle>Campaign Settings</DialogTitle>
              <DialogDescription>
                Configure your email campaign defaults
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="companyName" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Company Name</span>
            </Label>
            <Input
              id="companyName"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              placeholder="Your Company Name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fromEmail" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>From Email</span>
            </Label>
            <Input
              id="fromEmail"
              type="email"
              value={settings.fromEmail}
              onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
              placeholder="hello@company.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fromName" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>From Name</span>
            </Label>
            <Input
              id="fromName"
              value={settings.fromName}
              onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
              placeholder="Marketing Team"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="website" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Website URL</span>
            </Label>
            <Input
              id="website"
              type="url"
              value={settings.website}
              onChange={(e) => setSettings({ ...settings, website: e.target.value })}
              placeholder="https://yourcompany.com"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-indigo-600">
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
