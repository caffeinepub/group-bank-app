import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetAllMembers, useGetSummaryStats } from '../hooks/useQueries';
import { useTranslation } from '../hooks/useTranslation';
import MemberList from '../components/MemberList';
import AddMemberForm from '../components/AddMemberForm';
import SummaryStats from '../components/SummaryStats';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

export default function AdminPanel() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { t } = useTranslation();

  if (!identity) {
    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>{t('admin.accessDenied')}</AlertTitle>
        <AlertDescription>{t('admin.loginRequired')}</AlertDescription>
      </Alert>
    );
  }

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>{t('admin.accessDenied')}</AlertTitle>
        <AlertDescription>{t('admin.adminOnly')}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('admin.title')}</h1>
        <p className="text-muted-foreground">{t('admin.description')}</p>
      </div>

      <SummaryStats />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MemberList />
        </div>
        <div>
          <AddMemberForm />
        </div>
      </div>
    </div>
  );
}
