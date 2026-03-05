import { useGetAllMembers } from '../hooks/useQueries';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigate } from '@tanstack/react-router';
import MemberCard from './MemberCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users } from 'lucide-react';

export default function MemberList() {
  const { data: members, isLoading, error } = useGetAllMembers();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('members.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('members.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{t('members.loadError')}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t('members.title')} ({members?.length || 0}/26)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!members || members.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{t('members.empty')}</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {members.map((member) => (
              <MemberCard
                key={member.id.toString()}
                member={member}
                onClick={() => navigate({ to: '/member/$memberId', params: { memberId: member.id.toString() } })}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
