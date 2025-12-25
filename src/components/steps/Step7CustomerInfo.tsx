import React, { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { PriceSummary } from '@/components/PriceSummary';
import { User, Phone, Mail, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export const Step7CustomerInfo: React.FC = () => {
  const { order, setCustomerInfo, nextStep, prevStep } = useOrder();
  const { t } = useLanguage();
  const [info, setInfo] = useState(order.customerInfo);

  const handleChange = (field: string, value: string) => {
    const updated = { ...info, [field]: value };
    setInfo(updated);
    setCustomerInfo(updated);
  };

  const isValid = info.fullName.trim() && info.phone.trim();

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('step7.title')}</h1>
        <p className="text-muted-foreground">{t('step7.subtitle')}</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[
            { field: 'fullName', label: t('info.name'), icon: User, placeholder: '', required: true },
            { field: 'phone', label: t('info.phone'), icon: Phone, placeholder: '', required: true },
            { field: 'email', label: t('info.email'), icon: Mail, placeholder: '', required: false },
          ].map(({ field, label, icon: Icon, placeholder, required }) => (
            <div key={field} className="space-y-2">
              <label className="text-sm font-medium">{label} {required && <span className="text-destructive">*</span>}</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-accent flex items-center justify-center"><Icon className="w-5 h-5 text-primary" /></div>
                <input type={field === 'email' ? 'email' : 'text'} value={info[field as keyof typeof info]} onChange={(e) => handleChange(field, e.target.value)} placeholder={placeholder} className="w-full pl-16 pr-4 py-4 rounded-xl border-2 border-border bg-card focus:outline-none focus:border-primary" />
              </div>
            </div>
          ))}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2"><FileText className="w-4 h-4" />{t('info.notes')}</label>
            <textarea value={info.notes} onChange={(e) => handleChange('notes', e.target.value)} placeholder={t('info.notes')} rows={3} className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card focus:outline-none focus:border-primary resize-none" />
          </div>
        </div>
        <div className="space-y-4">
          <PriceSummary />
          <div className="flex gap-3">
            <Button variant="outline" onClick={prevStep} className="flex-1">{t('common.back')}</Button>
            <Button onClick={nextStep} className="flex-1" disabled={!isValid}>{t('common.next')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
