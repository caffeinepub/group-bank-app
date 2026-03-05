import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetMember, useGetMemberBalance, useGetPayments, useIsCallerAdmin } from '../hooks/useQueries';
import { useTranslation } from '../hooks/useTranslation';
import { Principal } from '@dfinity/principal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, Phone, Wallet } from 'lucide-react';
import PaymentHistory from '../components/PaymentHistory';
import RecordPaymentForm from '../components/RecordPaymentForm';
import PaymentQRCode from '../components/PaymentQRCode';

export default function MemberDetail() {
  const { memberId } = useParams({ from: '/member/$memberId' });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: isAdmin } = useIsCallerAdmin();

  const memberPrincipal = Principal.fromText(memberId);
  const { data: member, isLoading: memberLoading } = useGetMember(memberPrincipal);
  const { data: balance, isLoading: balanceLoading } = useGetMemberBalance(memberPrincipal);

  if (memberLoading || balanceLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t('member.notFound')}</p>
        <Button onClick={() => navigate({ to: '/' })} className="mt-4">
          {t('common.goBack')}
        </Button>
      </div>
    );
  }

  const profileImageUrl = member.profilePhoto?.getDirectURL() || '/assets/generated/default-avatar.dim_128x128.png';
  const joiningDate = new Date(Number(member.joiningDate) / 1000000);

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate({ to: isAdmin ? '/admin' : '/' })}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('common.back')}
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{t('member.profile')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={profileImageUrl} alt={member.name} />
                <AvatarFallback className="text-2xl">{member.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-center">{member.name}</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{member.mobile}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{t('member.joined')}: {joiningDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span>{t('member.totalPaid')}: ₹{balance?.totalPaid.toString() || '0'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('member.paymentSummary')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{t('member.totalInstallments')}</p>
                  <p className="text-3xl font-bold text-amber-600">{balance?.paymentCount.toString() || '0'}</p>
                </div>
                <div className="p-4 bg-teal-50 dark:bg-teal-900/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{t('member.totalAmount')}</p>
                  <p className="text-3xl font-bold text-teal-600">₹{balance?.totalPaid.toString() || '0'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {isAdmin && (
            <RecordPaymentForm memberId={memberPrincipal} />
          )}

          <PaymentQRCode />

          <PaymentHistory memberId={memberPrincipal} />
        </div>
      </div>
    </div>
  );
}
