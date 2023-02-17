import { ImageEventMessage, MessageEvent } from '@line/bot-sdk'

import { getMessageContentWithBuffer } from '~/domains/line.domain'
import { errorLogger } from '~/utils/util'

export const messageImageHandler = async (event: MessageEvent): Promise<void> => {
  try {
    const { id: messageId } = event.message as ImageEventMessage

    const imageBuffer = await getMessageContentWithBuffer(messageId)

    console.info(imageBuffer)
  } catch (err) {
    errorLogger(err)
    throw new Error('message image handler')
  }
}
