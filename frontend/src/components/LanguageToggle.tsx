import { useTranslation } from '../hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <Button variant="outline" size="sm" onClick={toggleLanguage} className="gap-2">
      <Languages className="h-4 w-4" />
      <span className="hidden sm:inline">{language === 'en' ? 'हिंदी' : 'English'}</span>
    </Button>
  );
}
