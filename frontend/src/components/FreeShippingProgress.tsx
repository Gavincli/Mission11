import { FREE_SHIPPING_THRESHOLD_USD } from '../constants/freeShipping';

function formatMoney(n: number) {
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

interface FreeShippingProgressProps {
    grandTotal: number;
}

export function FreeShippingProgress({ grandTotal }: FreeShippingProgressProps) {
    const threshold = FREE_SHIPPING_THRESHOLD_USD;
    const percent = Math.min(100, threshold > 0 ? (grandTotal / threshold) * 100 : 0);
    const rounded = Math.round(percent);
    const unlocked = grandTotal >= threshold;

    return (
        <div className="mt-3">
            <div className="small text-muted mb-1">
                {unlocked ? (
                    <span className="text-success fw-semibold">You unlocked free shipping.</span>
                ) : (
                    <>
                        {formatMoney(grandTotal)} of {formatMoney(threshold)} for free shipping
                    </>
                )}
            </div>
            <div
                className="progress"
                style={{ height: '1.25rem' }}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={rounded}
                aria-label="Progress toward free shipping"
            >
                <div
                    className={`progress-bar progress-bar-striped${unlocked ? ' bg-success' : ''}`}
                    style={{ width: `${rounded}%` }}
                />
            </div>
        </div>
    );
}
