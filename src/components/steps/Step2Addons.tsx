import React from 'react';
import { Package, Truck, ArrowDown, ArrowUp, Box, Wrench, Sparkles } from 'lucide-react';
import { AddonCard } from '@/components/AddonCard';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { AddonService } from '@/types/order';
import packingBoxes from '@/assets/packing-boxes.png';
import { useLanguage } from '@/context/LanguageContext';

export const Step2Addons: React.FC = () => {
  const { order, toggleAddon, setDontWorryBundle, nextStep, prevStep } = useOrder();
  const { t } = useLanguage();

  const addons = [
    { type: 'packing' as AddonService, title: t('addon.packing'), description: t('addon.packing.desc'), icon: Package },
    { type: 'loading' as AddonService, title: t('addon.loading'), description: t('addon.loading.desc'), icon: ArrowUp },
    { type: 'transportation' as AddonService, title: t('addon.transportation'), description: t('addon.transportation.desc'), icon: Truck },
    { type: 'unloading' as AddonService, title: t('addon.unloading'), description: t('addon.unloading.desc'), icon: ArrowDown },
    { type: 'unpacking' as AddonService, title: t('addon.unpacking'), description: t('addon.unpacking.desc'), icon: Box },
    { type: 'disassembly' as AddonService, title: t('addon.disassembly'), description: t('addon.disassembly.desc'), icon: Wrench },
  ];

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('step2.title')}</h1>
        <p className="text-muted-foreground">{t('step2.subtitle')}</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <AddonCard title={t('bundle.title')} description={t('bundle.desc')} icon={Sparkles} isSelected={order.hasDontWorryBundle} onClick={() => setDontWorryBundle(!order.hasDontWorryBundle)} isBundle />
          <div className="grid sm:grid-cols-2 gap-3">
            {addons.map(a => (
              <AddonCard key={a.type} title={a.title} description={a.description} icon={a.icon} isSelected={order.addons.includes(a.type)} onClick={() => toggleAddon(a.type)} disabled={order.hasDontWorryBundle} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="hidden lg:block">
            <img src={packingBoxes} alt={t('addon.packing')} className="w-full max-w-[200px] mx-auto opacity-80" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={prevStep} className="flex-1">{t('common.back')}</Button>
            <Button onClick={nextStep} className="flex-1">{t('common.next')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
