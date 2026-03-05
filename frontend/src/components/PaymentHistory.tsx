import { useGetPayments } from '../hooks/useQueries';
import { useTranslation } from '../hooks/useTranslation';
import { type Principal } from '@dfinity/principal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History } from 'lucide-react';

interface PaymentHistoryProps {
  memberId: Principal;
}

export default function PaymentHistory({ memberId }: PaymentHistoryProps) {
  const { data: payments, isLoading } = useGetPayments(memberId);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {t('payment.history')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          {t('payment.history')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!payments || payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{t('payment.noHistory')}</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('payment.date')}</TableHead>
                  <TableHead className="text-right">{t('payment.amount')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment, index) => {
                  const paymentDate = new Date(Number(payment.paymentDate) / 1000000);
                  return (
                    <TableRow key={index}>
                      <TableCell>{paymentDate.toLocaleDateString()}</TableCell>
                      <TableCell className="text-right font-medium">₹{payment.amount.toString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
