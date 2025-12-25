import React from 'react';
import { Home, Truck, Package, Building2 } from 'lucide-react';
import { ServiceCard } from '@/components/ServiceCard';
import { useOrder } from '@/context/OrderContext';
import { ServiceType } from '@/types/order';
import { useLanguage } from '@/context/LanguageContext';

export const Step1ServiceType: React.FC = () => {
  const { order, setServiceType, isLoading, nextStep } = useOrder();
  const { t } = useLanguage();

  const services = [
    { type: 'home-furniture' as ServiceType, title: t('service.home'), description: t('service.home.desc'), icon: Home },
    { type: 'intercity' as ServiceType, title: t('service.intercity'), description: t('service.intercity.desc'), icon: Truck },
    { type: 'moving-storage' as ServiceType, title: t('service.storage'), description: t('service.storage.desc'), icon: Package },
    { type: 'office-business' as ServiceType, title: t('service.office'), description: t('service.office.desc'), icon: Building2 },
  ];

  const handleSelect = async (type: ServiceType) => {
    await setServiceType(type);
    nextStep();
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('step1.title')}</h1>
        <p className="text-muted-foreground">{t('step1.subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(s => (
          <ServiceCard key={s.type} title={s.title} description={s.description} icon={s.icon} isSelected={order.serviceType === s.type} onClick={() => handleSelect(s.type)} disabled={isLoading} />
        ))}
      </div>
    </div>
  );
};
