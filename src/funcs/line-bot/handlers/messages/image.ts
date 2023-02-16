import { ImageEventMessage, MessageEvent } from '@line/bot-sdk'
import { logger } from 'firebase-functions/v1'

import { minusUserPoint } from '~/domains/point-transaction.domain'
import { getStripeCheckoutURL, getStripeCustomerIdByUserId } from '~/domains/stripe.domain'
import { imageToText } from '~/domains/vision.domain'
import { getInitUserData } from '~/types/models'
import { createUser, getUser, updateUser } from '~/types/users'
import { lineClient, makeReplyMessage } from '~/utils/line'
import { errorLogger } from '~/utils/util'

const messageIdToBuffer = async (messageId: string): Promise<Buffer> => {
  return new Promise((resolve, reject) =>
    lineClient
      .getMessageContent(messageId)
      .then((stream) => {
        const content: Buffer[] = []
        stream.on('data', (chunk: Buffer) => content.push(Buffer.from(chunk)))
        stream.on('end', () => resolve(Buffer.concat(content)))
        stream.on('error', (err) => {
          logger.error(err)
          reject('getMessageContent')
        })
      })
      .catch((err) => {
        logger.error(err)
        reject('getMessageContent')
      })
  )
}

// *********
// main関数
// *********

export const messageImageHandler = async (event: MessageEvent): Promise<void> => {
  try {
    const userId = event.source.userId as string
    const { id: messageId } = event.message as ImageEventMessage

    let user = await getUser(userId)
    if (user === null) {
      user = await createUser(userId, getInitUserData())
    }

    // ポイントが０の場合決済URLを送る
    if (user.point === 0) {
      // stripe customer id check
      const stripeCustomer = await getStripeCustomerIdByUserId(userId)

      // get url
      const { url } = await getStripeCheckoutURL({
        stripeCustomer,
        priceId: 'price_1Mc81lJFOEpiCtQrTR7XEtSz',
        mode: 'payment'
      })

      // return

      await lineClient.replyMessage(
        event.replyToken,
        makeReplyMessage(`こちらのURLより決済をお願いします。\n${url}`)
      )
      return
    }

    const buffer = await messageIdToBuffer(messageId)
    const text = await imageToText(buffer)

    // 文字起こしできなかった場合
    if (text === null) {
      await lineClient.replyMessage(
        event.replyToken,
        makeReplyMessage('文字起こしできませんでした。')
      )
      return
    }

    // 正常に文字起こしした時
    await lineClient.replyMessage(event.replyToken, makeReplyMessage(text))
    await minusUserPoint(userId, 1)
  } catch (err) {
    errorLogger(err)
    throw new Error('message image handler')
  }
}
