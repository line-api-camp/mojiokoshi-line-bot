import { ImageEventMessage, MessageEvent } from '@line/bot-sdk'

import { lineClient } from '~/clients/line.client'
import { getMessageContentWithBuffer } from '~/domains/line.domain'
import { getUserByUserId } from '~/domains/user.domain'
import { imageToText } from '~/domains/vision.domain'
import { makeReplyMessage } from '~/utils/line.util'
import { errorLogger } from '~/utils/util'

import { msgNotText } from '../../notice-messages/other'

export const messageImageHandler = async (event: MessageEvent): Promise<void> => {
  try {
    const userId = String(event.source.userId)
    const { id: messageId } = event.message as ImageEventMessage

    const user = await getUserByUserId(userId)

    const imageBuffer = await getMessageContentWithBuffer(messageId)
    let text = await imageToText(imageBuffer)

    if (text === null) {
      await lineClient.replyMessage(event.replyToken, msgNotText)
    } else {
      text = text.substring(0, 5000)
      await lineClient.replyMessage(event.replyToken, makeReplyMessage(text))
    }
  } catch (err) {
    errorLogger(err)
    throw new Error('message image handler')
  }
}
