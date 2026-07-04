import { PAYMENT_STATUS } from './payment.constants';
import type { TUserPayload } from '../../../../interfaces';
export interface IDpoCheckoutResult {
    url: string;
    token: string;
}
export interface IDpoVerifyResult {
    status: PAYMENT_STATUS;
    paid: boolean;
    resultCode?: string | undefined;
    resultExplanation?: string | undefined;
}
/**
 * 1️⃣ Create a DPO transaction token for a parcel and return the hosted
 * payment page URL the customer should be redirected to.
 */
export declare const createDpoCheckoutService: (user: TUserPayload, parcelId: string) => Promise<IDpoCheckoutResult>;
/**
 * 2️⃣ Verify a DPO transaction (called when the customer returns via the
 * redirect/back URL). Confirms the payment server-to-server with DPO and
 * updates the local Payment record. Idempotent.
 */
export declare const verifyDpoPaymentService: (params: {
    transToken?: string;
    companyRef?: string;
}) => Promise<IDpoVerifyResult>;
//# sourceMappingURL=dpo-payment.service.d.ts.map