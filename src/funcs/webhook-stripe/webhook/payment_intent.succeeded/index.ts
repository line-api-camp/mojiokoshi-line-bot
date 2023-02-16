import { stripeClient } from '~/clients/stripe.client'
import { addUserPoint } from '~/domains/point-transaction.domain'
import { getUser, updateUser } from '~/types/users'
import { lineClient, makeReplyMessage } from '~/utils/line'

type Props = {
  customerId: string
}

export const paymentIntentSucceededHandler = async ({ customerId }: Props): Promise<void> => {
  try {
    // customer to userId
    const customer = await stripeClient.customers.retrieve(customerId)
    if (customer.deleted) {
      return
    }

    const userId = String(customer.description)
    const user = await getUser(userId)
    if (user === null) {
      return
    }

    // add point.
    await addUserPoint(userId, 500)

    // line push
    await lineClient.pushMessage(userId, makeReplyMessage('ポイントを追加しました'))
  } catch (err) {
    console.error(err)
    console.error('paymentIntentSucceededHandler func.')
    throw Error
  }
}
