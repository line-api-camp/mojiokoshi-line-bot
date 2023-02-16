import axios from 'axios'

import { BotType } from '~/shared/types/models'
import { dayjs } from '~/utils/day'
import { IS_PROD } from '~/utils/secrets'
import { stripe } from '~/utils/stripe'

const OEKAKI_WEBHOOK_URL =
  'https://discord.com/api/webhooks/1063659829853425764/BCyoGkO0_KXzj4K-0mzpDl3E1PH93IaHMIErg3xQ6GIojlG3IjEOnvdzkpbsx7MIPHDj'
const ILLUST_OEKAKI_WEBHOOK_URL =
  'https://discord.com/api/webhooks/1063659837491257394/S7TCSS7zUplnKoc_aBRwFUGO5zi1d654hNURpnnmqclBit0IVlaLTvxsjAiVejpBu4PZ'

export const notifyDiscord = async (subscriptionId: string, createdTime: number, botType: BotType): Promise<void> => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  if (subscription.status !== 'active') {
    return
  }

  // @ts-ignore
  const planAmount: number = subscription?.plan?.amount
  if (!planAmount) {
    return
  }

  let planMessage: string
  switch (planAmount) {
    case 500:
      planMessage = '⛄️'
      break
    case 5000:
      planMessage = '👑'
      break
    default:
      return
  }

  const timeString = dayjs(createdTime * 1000)
    .tz()
    .format('YYYY年M月D日h時m分s秒')
  const message = `${IS_PROD ? '' : '[DEV]'}${timeString}：${planMessage}`

  const config = {
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json'
    }
  }

  let url: string, username: string
  switch (botType) {
    case 'oekaki':
      url = OEKAKI_WEBHOOK_URL
      username = 'お絵かきVG'
      break
    case 'illustOekaki':
      url = ILLUST_OEKAKI_WEBHOOK_URL
      username = 'イラストお絵かきVG'
      break
    default:
      url = OEKAKI_WEBHOOK_URL
      username = 'お絵かきVG'
  }

  const postData = {
    username,
    content: message
  }

  await axios.post(url, postData, config)
}
