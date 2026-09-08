/**
 * KalaConnect Modular Payment Architecture
 * 
 * Provides a clean separation between:
 * 1. Demo Payment Simulation (Hackathon sandbox with instant authorization,
 *    simulated UPI/Card tokenization, and realistic mock reference hashes)
 * 2. Real Production Payment Integration (Pluggable Razorpay / Stripe / UPI Deep Link architecture)
 */

export type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'cod';

export interface PaymentMethodData {
  type: PaymentMethodType;
  upiId?: string;
  upiApp?: 'gpay' | 'phonepe' | 'paytm' | 'bhim';
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
  bankCode?: string;
  bankName?: string;
}

export interface PaymentRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  method: PaymentMethodData;
  notes?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentMode: 'demo_simulation' | 'production_gateway';
  gatewayName: string;
  methodType: PaymentMethodType;
  timestamp: string;
  message: string;
  receiptUrl?: string;
  authCode?: string;
  error?: string;
}

export interface PaymentGateway {
  name: string;
  isSimulation: boolean;
  description: string;
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
}

/**
 * 1. Demo Payment Simulation (Hackathon Prototype)
 * Handles realistic sandboxed execution with mock bank authorization
 */
export class SimulatedPaymentGateway implements PaymentGateway {
  name = 'KalaConnect Sandbox Simulation (Demo)';
  isSimulation = true;
  description = 'Hackathon prototype simulated gateway with mock bank authorization and instant sandbox settlement.';

  // Configurable failure simulation for testing edge cases
  private simulateFailure = false;

  public setSimulateFailure(fail: boolean) {
    this.simulateFailure = fail;
  }

  public isSimulateFailureEnabled(): boolean {
    return this.simulateFailure;
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Simulate real-world bank network handshake delay (900ms)
    await new Promise((resolve) => setTimeout(resolve, 950));

    if (this.simulateFailure) {
      return {
        success: false,
        transactionId: `TXN_FAILED_${Date.now()}`,
        orderId: request.orderId,
        amount: request.amount,
        currency: request.currency || 'INR',
        paymentMode: 'demo_simulation',
        gatewayName: this.name,
        methodType: request.method.type,
        timestamp: new Date().toISOString(),
        message: 'Simulated Card/Bank Authorization Failed: Insufficient sandbox funds or declined by test issuer.',
        error: 'SIMULATED_DECLINE'
      };
    }

    const timestamp = new Date().toISOString();
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const txnId = `TXN_DEMO_${Date.now().toString().slice(-6)}${randomSuffix}`;
    const authCode = `AUTH_SBX_${Math.floor(1000 + Math.random() * 9000)}`;

    let message = 'Payment authorized successfully via Hackathon Sandbox Simulator.';
    if (request.method.type === 'upi') {
      message = `Simulated UPI request approved for ${request.method.upiId || 'VPA@okhdfcbank'}. Direct artisan royalty allocated.`;
    } else if (request.method.type === 'card') {
      message = `Simulated 3DS verified for card ending with ${(request.method.cardNumber || '4242').slice(-4)}.`;
    } else if (request.method.type === 'netbanking') {
      message = `Simulated NetBanking authorization completed via ${request.method.bankName || 'HDFC Bank'}.`;
    } else if (request.method.type === 'cod') {
      message = 'Cash on Delivery verified with GI physical seal on arrival.';
    }

    return {
      success: true,
      transactionId: txnId,
      orderId: request.orderId,
      amount: request.amount,
      currency: request.currency || 'INR',
      paymentMode: 'demo_simulation',
      gatewayName: this.name,
      methodType: request.method.type,
      timestamp,
      message,
      authCode,
      receiptUrl: `#receipt-${txnId}`
    };
  }
}

/**
 * 2. Production Payment Gateway Adapter
 * Pluggable architecture ready for live credentials (e.g. Razorpay / Stripe / UPI Gateway)
 */
export class ProductionPaymentGateway implements PaymentGateway {
  name = 'Production Payment Gateway (Razorpay / Stripe)';
  isSimulation = false;
  description = 'Live payment rail ready for merchant key integration, webhooks, and bank settlement.';

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // In production, this calls the secure backend route:
    // const res = await fetch('/api/payments/create-order', { method: 'POST', body: JSON.stringify(request) });
    // And opens the native Razorpay/Stripe checkout SDK.
    return {
      success: false,
      transactionId: `TXN_PROD_PENDING`,
      orderId: request.orderId,
      amount: request.amount,
      currency: request.currency || 'INR',
      paymentMode: 'production_gateway',
      gatewayName: this.name,
      methodType: request.method.type,
      timestamp: new Date().toISOString(),
      message: 'Production gateway credentials not configured in development sandbox. Please switch to Demo Payment Simulation for prototype testing.',
      error: 'PRODUCTION_KEYS_NOT_SET'
    };
  }
}

/**
 * Payment Service Controller
 * Orchestrates payment processing between Demo Simulation and Production
 */
class PaymentService {
  private simulatedGateway = new SimulatedPaymentGateway();
  private productionGateway = new ProductionPaymentGateway();
  private activeMode: 'demo_simulation' | 'production_gateway' = 'demo_simulation';

  public getActiveMode(): 'demo_simulation' | 'production_gateway' {
    return this.activeMode;
  }

  public setActiveMode(mode: 'demo_simulation' | 'production_gateway') {
    this.activeMode = mode;
  }

  public setSimulateFailure(fail: boolean) {
    this.simulatedGateway.setSimulateFailure(fail);
  }

  public isSimulateFailure(): boolean {
    return this.simulatedGateway.isSimulateFailureEnabled();
  }

  public async processPayment(
    request: PaymentRequest,
    overrideMode?: 'demo_simulation' | 'production_gateway'
  ): Promise<PaymentResult> {
    const mode = overrideMode || this.activeMode;

    if (mode === 'demo_simulation') {
      return this.simulatedGateway.processPayment(request);
    } else {
      return this.productionGateway.processPayment(request);
    }
  }
}

export const paymentService = new PaymentService();
