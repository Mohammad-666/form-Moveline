import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';
import { ADDON_PRICES, BUNDLE_PRICE, BUNDLE_SAVINGS } from '@/types/order';

interface PriceSummaryProps {
  className?: string;
  showDetails?: boolean;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  className,
  showDetails = true,
}) => {
  const { order, calculatePrice, isLoading } = useOrder();
  const totalPrice = calculatePrice();

  return (
    <div className={cn("bg-card border border-border rounded-xl p-4", className)}>
      <h4 className="font-semibold text-foreground mb-3">Price Summary</h4>
      
      {showDetails && (
        <div className="space-y-2 text-sm">
          {order.serviceType && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base service</span>
              <span className="text-foreground">
                ${order.serviceType === 'home-furniture' ? 150 : 
                   order.serviceType === 'intercity' ? 300 :
                   order.serviceType === 'moving-storage' ? 200 : 250}
              </span>
            </div>
          )}

          {order.hasDontWorryBundle ? (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Don't Worry Bundle</span>
              <div className="text-right">
                <span className="text-foreground">${BUNDLE_PRICE}</span>
                <span className="text-xs text-primary ml-2">(Save ${BUNDLE_SAVINGS})</span>
              </div>
            </div>
          ) : (
            order.addons.map(addon => (
              <div key={addon} className="flex justify-between">
                <span className="text-muted-foreground capitalize">{addon}</span>
                <span className="text-foreground">${ADDON_PRICES[addon]}</span>
              </div>
            ))
          )}

          {order.estimatedDistance && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Distance ({order.estimatedDistance} km)</span>
              <span className="text-foreground">${order.estimatedDistance * 2}</span>
            </div>
          )}

          {order.numberOfMovers > 2 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Extra movers ({order.numberOfMovers - 2})</span>
              <span className="text-foreground">${(order.numberOfMovers - 2) * 30}</span>
            </div>
          )}

          <div className="border-t border-border my-2 pt-2" />
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="font-semibold text-foreground">Total</span>
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        ) : (
          <span className="text-2xl font-bold text-primary">${totalPrice}</span>
        )}
      </div>
    </div>
  );
};
