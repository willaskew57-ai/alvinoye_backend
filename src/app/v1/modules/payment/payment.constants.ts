export enum PAYMENT_STATUS {
  PENDING = 'PENDING', // initial status after checkout session
  SUCCESS = 'SUCCESS', // payment completed
  REFUNDED = 'REFUNDED', // refunded
  FAILED = 'FAILED', // optional, if you want to track failed payments
}
