import React, { useState, useEffect } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { TrackingMap } from '@/components/TrackingMap';
import { CheckCircle2, Clock, Truck, MapPin, Phone, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const statuses = [
  { id: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
  { id: 'driver-assigned', label: 'Driver Assigned', icon: Truck },
  { id: 'in-transit', label: 'In Transit', icon: MapPin },
  { id: 'arrived', label: 'Arrived', icon: CheckCircle2 },
];

export const Step9Tracking: React.FC = () => {
  const { order, nextStep } = useOrder();
  const { t } = useLanguage();
  const currentIdx = statuses.findIndex(s => s.id === order.tracking.status) || 0;
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(15);

  // Simulate real-time vehicle movement
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) {
          clearInterval(interval);
          return 1;
        }
        return prev + 0.02;
      });
      setEta(prev => Math.max(0, prev - 0.3));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Default coordinates if not set
  const pickupCoords: [number, number] = order.pickupLocation?.lng && order.pickupLocation?.lat
    ? [order.pickupLocation.lng, order.pickupLocation.lat]
    : [46.6753, 24.7136]; // Default Riyadh

  const dropoffCoords: [number, number] = order.dropoffLocation?.lng && order.dropoffLocation?.lat
    ? [order.dropoffLocation.lng, order.dropoffLocation.lat]
    : [46.7, 24.75]; // Nearby location

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('step9.title')}</h1>
        <p className="text-muted-foreground">{t('step9.subtitle')}</p>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Status Timeline */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="space-y-4">
            {statuses.map((s, i) => (
              <div key={s.id} className="flex items-center gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                  i <= currentIdx ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className={cn(
                    'font-medium',
                    i <= currentIdx ? 'text-foreground' : 'text-muted-foreground'
                  )}>{t(`tracking.${s.id}`) || s.label}</span>
                </div>
                {i <= currentIdx && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </div>
            ))}
          </div>
        </div>

        {/* Live Map Tracking */}
        <TrackingMap
          pickupCoords={pickupCoords}
          dropoffCoords={dropoffCoords}
          progress={progress}
        />

        {/* Driver & ETA Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Driver</p>
            <p className="font-semibold">Ahmed Hassan</p>
            <p className="text-sm text-muted-foreground">Vehicle: ML-2024</p>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-yellow-500">★★★★★</span>
              <span className="text-xs text-muted-foreground">4.9</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Estimated Arrival</p>
            <p className="font-semibold text-2xl text-primary">{Math.round(eta)} min</p>
            <div className="mt-2 w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            <Phone className="w-4 h-4 mr-2" />
            Call Driver
          </Button>
          <Button variant="outline" className="flex-1">
            <MessageCircle className="w-4 h-4 mr-2" />
            Support
          </Button>
        </div>

        <Button onClick={nextStep} className="w-full">
          Complete & Rate Service
        </Button>
      </div>
    </div>
  );
};
