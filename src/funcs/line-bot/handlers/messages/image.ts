import { ImageEventMessage, MessageEvent } from '@line/bot-sdk'
import { logger } from 'firebase-functions/v1'

import { imageToText } from '~/domains/vision.domain'
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
    const { id: messageId } = event.message as ImageEventMessage

    const buffer = await messageIdToBuffer(messageId)
    const text = await imageToText(buffer)

    if (text === null) {
      await lineClient.replyMessage(
        event.replyToken,
        makeReplyMessage('文字起こしできませんでした。')
      )
    } else {
      await lineClient.replyMessage(event.replyToken, makeReplyMessage(text))
    }
  } catch (err) {
    errorLogger(err)
    throw new Error('message image handler')
  }
}
