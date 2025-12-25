import React, { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { Star, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export const Step10Rating: React.FC = () => {
  const { submitRating, isLoading, order, resetOrder } = useOrder();
  const { t } = useLanguage();
  const [serviceRating, setServiceRating] = useState(0);
  const [staffRating, setStaffRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    await submitRating({ serviceRating, staffRating, feedback });
    setSubmitted(true);
  };

  if (submitted || order.rating) {
    return (
      <div className="animate-fade-in text-center py-12">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('common.success')}</h1>
        <p className="text-muted-foreground mb-8">{t('rating.feedback')}</p>
        <Button onClick={resetOrder}>{t('common.submit')}</Button>
      </div>
    );
  }

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label?: string }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} onClick={() => onChange(i)} aria-label={`${label || t('rating.service')} ${i}`} className="p-1">
          <Star className={cn('w-8 h-8 transition-colors', i <= value ? 'fill-primary text-primary' : 'text-muted-foreground')} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('step10.title')}</h1>
        <p className="text-muted-foreground">{t('step10.subtitle')}</p>
      </div>
      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="text-center">
            <p className="font-medium mb-3">{t('rating.service')}</p>
            <StarRating value={serviceRating} onChange={setServiceRating} label={t('rating.service')} />
          </div>
          <div className="text-center">
            <p className="font-medium mb-3">{t('rating.staff')}</p>
            <StarRating value={staffRating} onChange={setStaffRating} label={t('rating.staff')} />
          </div>
          <div>
            <label className="text-sm font-medium">{t('rating.feedback')}</label>
            <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder={t('rating.feedback')} rows={4} className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary resize-none" />
          </div>
        </div>
        <Button onClick={handleSubmit} className="w-full" disabled={!serviceRating || !staffRating || isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Rating'}
        </Button>
      </div>
    </div>
  );
};
