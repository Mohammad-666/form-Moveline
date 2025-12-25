import React from 'react';
import { Truck } from 'lucide-react';
import { OrderProvider, useOrder } from '@/context/OrderContext';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import { OrderStepper } from '@/components/OrderStepper';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Chatbot } from '@/components/Chatbot';
import { Button } from '@/components/ui/button';
import {
  Step1ServiceType,
  Step2Addons,
  Step3Locations,
  Step4PhotoAnalysis,
  Step5ConfirmDetails,
  Step6Schedule,
  Step7CustomerInfo,
  Step8Payment,
  Step9Tracking,
  Step10Rating,
} from '@/components/steps';

const steps = [
  { number: 1, title: 'Service Type', shortTitle: 'Service', key: 'step.service' },
  { number: 2, title: 'Add-ons', shortTitle: 'Add-ons', key: 'step.addons' },
  { number: 3, title: 'Locations', shortTitle: 'Locations', key: 'step.locations' },
  { number: 4, title: 'Photos', shortTitle: 'Photos', key: 'step.photos' },
  { number: 5, title: 'Confirm', shortTitle: 'Confirm', key: 'step.confirm' },
  { number: 6, title: 'Schedule', shortTitle: 'Schedule', key: 'step.schedule' },
  { number: 7, title: 'Info', shortTitle: 'Info', key: 'step.info' },
  { number: 8, title: 'Payment', shortTitle: 'Payment', key: 'step.payment' },
  { number: 9, title: 'Tracking', shortTitle: 'Tracking', key: 'step.tracking' },
  { number: 10, title: 'Rating', shortTitle: 'Rating', key: 'step.rating' },
];

const StepRenderer: React.FC = () => {
  const { order } = useOrder();

  switch (order.step) {
    case 1:
      return <Step1ServiceType />;
    case 2:
      return <Step2Addons />;
    case 3:
      return <Step3Locations />;
    case 4:
      return <Step4PhotoAnalysis />;
    case 5:
      return <Step5ConfirmDetails />;
    case 6:
      return <Step6Schedule />;
    case 7:
      return <Step7CustomerInfo />;
    case 8:
      return <Step8Payment />;
    case 9:
      return <Step9Tracking />;
    case 10:
      return <Step10Rating />;
    default:
      return <Step1ServiceType />;
  }
};

const NavigationButtons: React.FC = () => {
  const { order, nextStep, prevStep, isLoading } = useOrder();
  const { t } = useLanguage();

  // Don't show navigation on first step, tracking, or rating
  if (order.step === 1 || order.step === 9 || order.step === 10) {
    return null;
  }

  return (
    <div className="flex justify-between mt-8 gap-4">
      <Button
        variant="outline"
        onClick={prevStep}
        disabled={isLoading}
        className="min-w-[120px]"
      >
        {t('common.back')}
      </Button>
      {order.step < 8 && (
        <Button
          onClick={nextStep}
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {t('common.next')}
        </Button>
      )}
    </div>
  );
};

const OrderWizard: React.FC = () => {
  const { order, goToStep } = useOrder();
  const { t } = useLanguage();

  const translatedSteps = steps.map(step => ({
    ...step,
    title: t(step.key),
    shortTitle: t(step.key),
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{t('app.title')}</h1>
                <p className="text-xs text-muted-foreground">{t('app.subtitle')}</p>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Stepper */}
      <div className="container mx-auto px-4 py-4">
        <OrderStepper
          steps={translatedSteps}
          currentStep={order.step}
          onStepClick={goToStep}
        />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <StepRenderer />
          <NavigationButtons />
        </div>
      </main>

      {/* Price Summary - Show from step 2 onwards */}
     

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <LanguageProvider>
      <OrderProvider>
        <OrderWizard />
      </OrderProvider>
    </LanguageProvider>
  );
};

export default Index;
