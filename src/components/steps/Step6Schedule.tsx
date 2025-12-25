import React, { useState, useEffect } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { PriceSummary } from '@/components/PriceSummary';
import { Calendar } from '@/components/ui/calendar';
import { mockApi } from '@/lib/mockApi';
import { TimeSlot } from '@/types/order';
import { Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export const Step6Schedule: React.FC = () => {
  const { order, setScheduledDate, setScheduledTimeSlot, nextStep, prevStep } = useOrder();
  const { t } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(order.scheduledDate || undefined);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (date) {
      setLoading(true);
      mockApi.getAvailability(date).then(s => { setSlots(s); setLoading(false); });
    }
  }, [date]);

  const handleDateSelect = (d: Date | undefined) => {
    if (d) { setDate(d); setScheduledDate(d); }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('step6.title')}</h1>
        <p className="text-muted-foreground">{t('step6.subtitle')}</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <Calendar mode="single" selected={date} onSelect={handleDateSelect} disabled={(d) => d < new Date()} className="rounded-md" />
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2"><Clock className="w-5 h-5 text-primary" />{t('schedule.time')}</h3>
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : date ? (
              <div className="space-y-2">
                {slots.map(s => (
                  <button key={s.id} onClick={() => s.available && setScheduledTimeSlot(s)} disabled={!s.available} className={cn('w-full p-3 rounded-lg border-2 text-left transition-all', order.scheduledTimeSlot?.id === s.id ? 'border-primary bg-primary-light' : s.available ? 'border-border hover:border-primary/50' : 'border-border opacity-50 cursor-not-allowed')}>
                    <span className="font-medium">{s.time}</span>
                    {!s.available && <span className="text-xs text-muted-foreground ml-2">Unavailable</span>}
                  </button>
                ))}
              </div>
            ) : <p className="text-muted-foreground text-sm">{t('schedule.date')}</p>}
          </div>
        </div>
        <div className="space-y-4">
          <PriceSummary />
          <div className="flex gap-3">
            <Button variant="outline" onClick={prevStep} className="flex-1">{t('common.back')}</Button>
            <Button onClick={nextStep} className="flex-1" disabled={!order.scheduledDate || !order.scheduledTimeSlot}>{t('common.next')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
