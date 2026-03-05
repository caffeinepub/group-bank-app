import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Users, Wallet, TrendingUp } from 'lucide-react';
import ProfileSetupModal from '../components/ProfileSetupModal';

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            {t('home.welcome')}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {t('home.description')}
          </p>
        </div>
      </div>
    );
  }

  if (showProfileSetup) {
    return <ProfileSetupModal />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {t('home.welcomeBack')}, {userProfile?.name || t('common.user')}
        </h1>
        <p className="text-muted-foreground">{t('home.dashboardDescription')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <CardTitle>{t('home.members')}</CardTitle>
                <CardDescription>{t('home.membersDesc')}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-100 dark:bg-teal-900/20 rounded-lg">
                <Wallet className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <CardTitle>{t('home.payments')}</CardTitle>
                <CardDescription>{t('home.paymentsDesc')}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>{t('home.tracking')}</CardTitle>
                <CardDescription>{t('home.trackingDesc')}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('home.quickActions')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button onClick={() => navigate({ to: '/member/$memberId', params: { memberId: identity?.getPrincipal().toString() || '' } })}>
            {t('home.viewProfile')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
