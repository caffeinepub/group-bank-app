import { useState } from 'react';
import { useAddMember } from '../hooks/useQueries';
import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

export default function AddMemberForm() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const { mutate: addMember, isPending } = useAddMember();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(t('addMember.nameRequired'));
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      toast.error(t('addMember.mobileInvalid'));
      return;
    }

    addMember(
      { name: name.trim(), mobile },
      {
        onSuccess: () => {
          toast.success(t('addMember.success'));
          setName('');
          setMobile('');
        },
        onError: (error) => {
          toast.error(t('addMember.error'));
          console.error('Add member error:', error);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          {t('addMember.title')}
        </CardTitle>
        <CardDescription>{t('addMember.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="memberName">{t('addMember.name')}</Label>
            <Input
              id="memberName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('addMember.namePlaceholder')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="memberMobile">{t('addMember.mobile')}</Label>
            <Input
              id="memberMobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder={t('addMember.mobilePlaceholder')}
              maxLength={10}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t('common.adding') : t('addMember.button')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
