import React from 'react';
import { PhotoUpload } from '@/components/PhotoUpload';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { Loader2, Package, Truck, Users, Wrench, Boxes, Camera } from 'lucide-react';
import packingBoxes from '@/assets/packing-boxes.png';
import { useLanguage } from '@/context/LanguageContext';

export const Step4PhotoAnalysis: React.FC = () => {
  const { order, addPhoto, removePhoto, analyzePhotos, isLoading, nextStep, prevStep } = useOrder();
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('step4.title')}</h1>
        <p className="text-muted-foreground">{t('step4.subtitle')}</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Instructions */}
          <div className="bg-accent/50 rounded-xl p-4 flex items-start gap-3">
            <Camera className="w-5 h-5 text-primary mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">{t('photo.upload')}</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{t('photo.upload')}</li>
                <li>{t('ai.type')}</li>
                <li>{t('ai.disassembly')}</li>
              </ul>
            </div>
          </div>

          <PhotoUpload photos={order.photos} onAddPhoto={addPhoto} onRemovePhoto={removePhoto} />
          
          {order.photos.length > 0 && !order.aiAnalysis && (
            <Button onClick={analyzePhotos} disabled={isLoading} className="w-full">
              {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('photo.analyzing')}</> : t('photo.analyze')}
            </Button>
          )}
          
          {order.aiAnalysis && (
            <div className="bg-accent rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2"><Package className="w-5 h-5 text-primary" />{t('step4.title')}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2"><Boxes className="w-4 h-4 text-primary" /><span>{t('ai.volume')}: {order.aiAnalysis.volume}</span></div>
                <div className="flex items-center gap-2"><Package className="w-4 h-4 text-primary" /><span>{t('ai.items')}: {order.aiAnalysis.itemCount}</span></div>
                <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-primary" /><span>{t('ai.vehicle')}: {order.aiAnalysis.suggestedVehicle}</span></div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /><span>{t('ai.movers')}: {order.aiAnalysis.suggestedMovers}</span></div>
                <div className="flex items-center gap-2"><Wrench className="w-4 h-4 text-primary" /><span>{t('ai.disassembly')}: {order.aiAnalysis.disassemblyNeeded ? t('common.yes') : t('common.no')}</span></div>
              </div>
              <div className="mt-4 p-3 bg-primary/10 rounded-lg text-sm text-primary font-medium">
                ✓ {t('common.success')}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="hidden lg:block">
            <img src={packingBoxes} alt="Items to move" className="w-full max-w-[200px] mx-auto opacity-80" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={prevStep} className="flex-1">Back</Button>
            <Button onClick={nextStep} className="flex-1">Continue</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
