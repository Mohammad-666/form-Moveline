import React from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { PriceSummary } from '@/components/PriceSummary';
import { Truck, Users, Minus, Plus, MapPin, Package, Route, Sparkles } from 'lucide-react';
import movingTruck from '@/assets/moving-truck.png';
import { useLanguage } from '@/context/LanguageContext';

const vehicles = [
  { type: 'Van', description: 'Small moves, few items', icon: '🚐' },
  { type: 'Medium Truck', description: '1-2 bedroom apartment', icon: '🚚' },
  { type: 'Large Truck', description: 'Full house, office', icon: '🚛' },
];

export const Step5ConfirmDetails: React.FC = () => {
  const { order, setVehicleType, setNumberOfMovers, nextStep, prevStep, calculatePrice } = useOrder();
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('step5.title')}</h1>
        <p className="text-muted-foreground">{t('step5.subtitle')}</p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Card */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Order Summary
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                      <span className="text-muted-foreground block">{t('location.pickup')}:</span>
                    <span className="font-medium">{order.pickupLocation?.address || t('common.loading')}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                  <div>
                    <span className="text-muted-foreground block">{t('location.dropoff')}:</span>
                    <span className="font-medium">{order.dropoffLocation?.address || t('common.loading')}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {order.estimatedDistance && (
                    <div className="flex items-center gap-2">
                    <Route className="w-4 h-4 text-primary" />
                    <span>{t('location.distance')}: <strong>{order.estimatedDistance} {t('location.km')}</strong></span>
                  </div>
                )}
                {order.aiAnalysis && (
                  <>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      <span>Volume: <strong>{order.aiAnalysis.volume}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      <span>Items: <strong>{order.aiAnalysis.itemCount}</strong></span>
                    </div>
                  </>
                )}
                {order.hasDontWorryBundle && (
                    <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-medium">{t('bundle.title')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Selection */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              {t('confirm.vehicle')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {vehicles.map(v => (
                <button 
                  key={v.type} 
                  onClick={() => setVehicleType(v.type)} 
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    order.vehicleType === v.type 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-3xl block mb-2">{v.icon}</span>
                  <span className="text-sm font-medium block">{v.type}</span>
                  <span className="text-xs text-muted-foreground">{v.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Number of Movers */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              {t('confirm.movers')}
            </h3>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setNumberOfMovers(Math.max(1, order.numberOfMovers - 1))}
                aria-label={`Decrease ${t('confirm.movers')}`}
                className="w-12 h-12 rounded-full border-2 border-border hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all"
              >
                <Minus className="w-5 h-5" />
              </button>
              <div className="text-center">
                <span className="text-5xl font-bold text-primary">{order.numberOfMovers}</span>
                <p className="text-sm text-muted-foreground mt-1">{t('confirm.movers')}</p>
              </div>
              <button
                onClick={() => setNumberOfMovers(Math.min(8, order.numberOfMovers + 1))}
                aria-label={`Increase ${t('confirm.movers')}`}
                className="w-12 h-12 rounded-full border-2 border-border hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-3">
              {order.aiAnalysis?.suggestedMovers && `${t('ai.movers')}: ${order.aiAnalysis.suggestedMovers}`}
            </p>
          </div>
        </div>

        {/* Price Summary - Now visible for the first time! */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary rounded-xl p-1">
            <PriceSummary showDetails={true} />
          </div>
          <div className="hidden lg:block">
            <img src={movingTruck} alt="Moving truck" className="w-full max-w-[180px] mx-auto opacity-80" />
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
