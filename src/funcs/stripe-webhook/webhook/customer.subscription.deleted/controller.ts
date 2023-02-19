import { lineClient } from '~/clients/line.client'
import { stripeClient } from '~/clients/stripe.client'
import { getRichMenuId } from '~/domains/richmenu.domain'
import { getUserByUserId } from '~/domains/user.domain'
import { updateUserDb } from '~/libs/firebase/firestore/user'
import { makeReplyMessage } from '~/utils/line.util'

interface Props {
  customerId: string
}

export const customerSubscriptionDeletedController = async (props: Props): Promise<void> => {
  const { customerId } = props

  // stripe customer check.
  const customer = await stripeClient.customers.retrieve(customerId)
  if (customer.deleted) {
    return
  }

  // user check.
  const userId = customer.description
  const user = await getUserByUserId(userId!)
  if (user === null || !user.isActive) {
    return
  }

  // subscription check.
  const { data: subscriptionList } = await stripeClient.subscriptions.list({ customer: customerId })
  if (subscriptionList.length === 0) {
    return
  }

  const richMenuId = await getRichMenuId('default')
  await Promise.all([
    updateUserDb(userId!, { isActive: false }),
    lineClient.pushMessage(userId!, makeReplyMessage('キャンセル完了しました')),
    richMenuId && lineClient.linkRichMenuToUser(userId!, richMenuId)
  ])
}
