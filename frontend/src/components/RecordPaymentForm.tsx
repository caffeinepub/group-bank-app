import { useState } from 'react';
import { useRecordPayment } from '../hooks/useQueries';
import { useTranslation } from '../hooks/useTranslation';
import { type Principal } from '@dfinity/principal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Receipt } from 'lucide-react';

interface RecordPaymentFormProps {
  memberId: Principal;
}

export default function RecordPaymentForm({ memberId }: RecordPaymentFormProps) {
  const [amount, setAmount] = useState('1000');
  const { mutate: recordPayment, isPending } = useRecordPayment();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error(t('recordPayment.invalidAmount'));
      return;
    }

    recordPayment(
      { memberId, amount: BigInt(amountNum) },
      {
        onSuccess: () => {
          toast.success(t('recordPayment.success'));
          setAmount('1000');
        },
        onError: (error) => {
          toast.error(t('recordPayment.error'));
          console.error('Record payment error:', error);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          {t('recordPayment.title')}
        </CardTitle>
        <CardDescription>{t('recordPayment.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">{t('recordPayment.amount')}</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t('common.recording') : t('recordPayment.button')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
