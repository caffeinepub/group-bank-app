import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentQRCode() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const upiId = '9315341037@ybl';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      toast.success(t('payment.copiedUPI'));
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error(t('payment.copyError'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          {t('payment.qrTitle')}
        </CardTitle>
        <CardDescription>{t('payment.qrDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <img
            src="/assets/generated/payment-qr.dim_300x300.png"
            alt="Payment QR Code"
            className="w-64 h-64"
          />
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">{t('payment.upiId')}</p>
          <div className="flex items-center gap-2">
            <code className="text-lg font-mono font-semibold bg-muted px-4 py-2 rounded">
              {upiId}
            </code>
            <Button variant="outline" size="icon" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
