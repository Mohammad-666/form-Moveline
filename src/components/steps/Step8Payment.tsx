import React, { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { PriceSummary } from '@/components/PriceSummary';
import { CreditCard, Banknote, Percent, Loader2 } from 'lucide-react';
import { PaymentMethod } from '@/types/order';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const methods = [
  { id: 'card' as PaymentMethod, titleKey: 'payment.card', icon: CreditCard },
  { id: 'cash' as PaymentMethod, titleKey: 'payment.cash', icon: Banknote },
  { id: 'partial' as PaymentMethod, titleKey: 'payment.partial', icon: Percent },
];

export const Step8Payment: React.FC = () => {
  const { order, setPaymentInfo, processPayment, isLoading, nextStep, prevStep, calculatePrice } = useOrder();
  const { t } = useLanguage();
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePay = async () => {
    setPaymentInfo({ method, cardNumber, expiryDate: expiry, cvv });
    try {
      await processPayment();
      nextStep();
    } catch {}
  };

  const isValid = method === 'cash' || (cardNumber.length >= 16 && expiry && cvv);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('step8.title')}</h1>
        <p className="text-muted-foreground">{t('step8.subtitle')}</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {methods.map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)} className={cn('p-4 rounded-xl border-2 text-center transition-all', method === m.id ? 'border-primary bg-primary-light' : 'border-border hover:border-primary/50')}>
                <m.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">{t(m.titleKey)}</span>
              </button>
            ))}
          </div>
          {method === 'card' && (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Card Number</label>
                <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))} placeholder="1234 5678 9012 3456" className="w-full mt-1 px-4 py-3 rounded-xl border-2 border-border focus:outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Expiry</label>
                  <input type="text" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" className="w-full mt-1 px-4 py-3 rounded-xl border-2 border-border focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium">CVV</label>
                  <input type="text" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" className="w-full mt-1 px-4 py-3 rounded-xl border-2 border-border focus:outline-none focus:border-primary" />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <PriceSummary />
          <div className="flex gap-3">
            <Button variant="outline" onClick={prevStep} className="flex-1">{t('common.back')}</Button>
            <Button onClick={handlePay} className="flex-1" disabled={!isValid || isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `${t('payment.pay')} ${t('common.currency')}${calculatePrice()}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
