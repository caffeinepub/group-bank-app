import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { useTranslation } from '../hooks/useTranslation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(t('profile.nameRequired'));
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      toast.error(t('profile.mobileInvalid'));
      return;
    }

    saveProfile(
      { name: name.trim(), mobile, joiningDate: BigInt(Date.now() * 1000000), profilePhoto: undefined },
      {
        onSuccess: () => {
          toast.success(t('profile.setupSuccess'));
        },
        onError: (error) => {
          toast.error(t('profile.setupError'));
          console.error('Profile setup error:', error);
        },
      }
    );
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('profile.setupTitle')}</DialogTitle>
          <DialogDescription>{t('profile.setupDescription')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('profile.name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('profile.namePlaceholder')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">{t('profile.mobile')}</Label>
            <Input
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder={t('profile.mobilePlaceholder')}
              maxLength={10}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t('common.saving') : t('profile.setupButton')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
