import { Stripe } from 'stripe'

import { stripeClient } from '~/clients/stripe.client'

type SinglePayment = {
  stripeCustomer: string
  priceId: string
  mode: Stripe.Checkout.SessionCreateParams.Mode
}

export const getStripeCheckoutURL = async (props: SinglePayment): Promise<{ url: string }> => {
  const { stripeCustomer, priceId, mode } = props

  try {
    const { url } = await stripeClient.checkout.sessions.create({
      customer: stripeCustomer,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      payment_method_types: ['card'],
      mode,
      success_url: 'https://twitter.com/hyodoblog',
      cancel_url: 'https://twitter.com/hyodoblog'
    })

    if (url === null) {
      throw new Error('stripe checkout url is null.')
    }

    return { url }
  } catch (err) {
    console.error(err)
    console.error('getCheckoutURLBySinglePayment func.')
    throw Error
  }
}
