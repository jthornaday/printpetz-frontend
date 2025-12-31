export interface CheckoutRequest {
  priceId: string;
}

export interface CheckoutResponse {
  session: {
    id: string;
    url: string;
  };
}
