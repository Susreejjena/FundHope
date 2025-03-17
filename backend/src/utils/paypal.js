const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

// Creating an environment
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  // Check if we're in production or sandbox mode
  return process.env.NODE_ENV === 'production'
    ? new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
    : new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

// Creating a client
function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

// Create order function
async function createOrder(amount, currency = 'USD', description) {
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount.toString(),
        },
        description: description || 'Donation to FundHope campaign',
      },
    ],
    application_context: {
      return_url: 'https://www.example.com/success',
      cancel_url: 'https://www.example.com/cancel',
    },
  });

  const paypalClient = client();
  const response = await paypalClient.execute(request);
  return response.result;
}

// Capture payment function
async function capturePayment(orderId) {
  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  const paypalClient = client();
  const response = await paypalClient.execute(request);
  return response.result;
}

module.exports = { createOrder, capturePayment }; 