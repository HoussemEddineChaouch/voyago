import { Injectable } from '@angular/core';
import {
  loadStripe,
  Stripe,
  StripeCardElement,
  StripeElements,
} from '@stripe/stripe-js';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class StripeService {
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;

  async init(): Promise<Stripe> {
    if (!this.stripe) {
      this.stripe = await loadStripe(environment.stripePublishableKey);
      if (!this.stripe) throw new Error('Stripe failed to load');
    }
    return this.stripe;
  }

  async mountCard(containerId: string): Promise<void> {
    const stripe = await this.init();
    this.elements = stripe.elements();
    this.cardElement = this.elements.create('card', {
      hidePostalCode: true,
      style: {
        base: {
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '15px',
          color: '#0F172A',
          '::placeholder': { color: '#9CA3AF' },
        },
        invalid: { color: '#EF4444' },
      },
    });
    this.cardElement.mount(`#${containerId}`);
  }

  async confirmPayment(clientSecret: string, billingName: string) {
    const stripe = await this.init();
    if (!this.cardElement) throw new Error('Card element not mounted');

    return stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.cardElement,
        billing_details: { name: billingName },
      },
    });
  }

  destroyCard() {
    this.cardElement?.destroy();
    this.cardElement = null;
    this.elements = null;
  }
}
