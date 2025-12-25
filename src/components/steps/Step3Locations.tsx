import React, { useState, useEffect, useCallback } from 'react';
import { LocationMap } from '@/components/LocationMap';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Navigation, Route } from 'lucide-react';
import movingTruck from '@/assets/moving-truck.png';
import { useLanguage } from '@/context/LanguageContext';

export const Step3Locations: React.FC = () => {
  const { order, setPickupLocation, setDropoffLocation, nextStep, prevStep } = useOrder();
  const { t } = useLanguage();

  // 🔹 نستخدم [lat, lng] بكل المشروع
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(
    order.pickupLocation?.lat && order.pickupLocation?.lng
      ? [order.pickupLocation.lat, order.pickupLocation.lng]
      : null
  );

  const [dropoffCoords, setDropoffCoords] = useState<[number, number] | null>(
    order.dropoffLocation?.lat && order.dropoffLocation?.lng
      ? [order.dropoffLocation.lat, order.dropoffLocation.lng]
      : null
  );

  const [pickupAddress, setPickupAddress] = useState(order.pickupLocation?.address || '');
  const [dropoffAddress, setDropoffAddress] = useState(order.dropoffLocation?.address || '');
  const [distance, setDistance] = useState<number | null>(order.estimatedDistance);
  const [duration, setDuration] = useState<number | null>(order.estimatedDuration);

  // 📏 حساب المسافة بدون أي API
  const calculateDistance = useCallback(() => {
    if (!pickupCoords || !dropoffCoords) return;

    const R = 6371;
    const dLat = (dropoffCoords[0] - pickupCoords[0]) * Math.PI / 180;
    const dLon = (dropoffCoords[1] - pickupCoords[1]) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(pickupCoords[0] * Math.PI / 180) *
      Math.cos(dropoffCoords[0] * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const dist = Math.round(R * c);
    setDistance(dist);
    setDuration(Math.round(dist * 2)); // تقريب: 2 دقيقة لكل كم
  }, [pickupCoords, dropoffCoords]);

  useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      calculateDistance();
    }
  }, [pickupCoords, dropoffCoords, calculateDistance]);

  const handlePickupSelect = (coords: [number, number], address: string) => {
    setPickupCoords(coords);
    setPickupAddress(address);
  };

  const handleDropoffSelect = (coords: [number, number], address: string) => {
    setDropoffCoords(coords);
    setDropoffAddress(address);
  };

  const handleContinue = () => {
    if (!pickupCoords || !dropoffCoords) return;

    setPickupLocation({
      address: pickupAddress,
      city: pickupAddress.split(',')[1]?.trim() || 'City',
      lat: pickupCoords[0],
      lng: pickupCoords[1],
    });

    setDropoffLocation({
      address: dropoffAddress,
      city: dropoffAddress.split(',')[1]?.trim() || 'City',
      lat: dropoffCoords[0],
      lng: dropoffCoords[1],
    });

    nextStep();
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('step3.title')}</h1>
        <p className="text-muted-foreground">{t('step3.subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* العناوين */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-green-500" />
                <span className="font-medium">{t('location.pickup')}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{pickupAddress || ''}</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-5 h-5 text-red-500" />
                <span className="font-medium">{t('location.dropoff')}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{dropoffAddress || ''}</p>
            </div>
          </div>

          {/* الخريطة */}
          <LocationMap
            pickupCoords={pickupCoords}
            dropoffCoords={dropoffCoords}
            onPickupSelect={handlePickupSelect}
            onDropoffSelect={handleDropoffSelect}
          />

          {/* المسافة والوقت */}
          {distance && duration && (
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 bg-accent rounded-lg">
                <Route className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{distance} {t('location.km')}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-accent rounded-lg">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{duration} {t('location.min')}</span>
              </div>
            </div>
          )}
        </div>

        {/* الجانب اليمين */}
        <div className="space-y-4">

          <div className="hidden lg:block">
            <img
              src={movingTruck}
              alt="Moving truck"
              className="w-full max-w-[200px] mx-auto opacity-80"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={prevStep} className="flex-1">{t('common.back')}</Button>
            <Button onClick={handleContinue} className="flex-1" disabled={!pickupCoords || !dropoffCoords}>{t('common.next')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
