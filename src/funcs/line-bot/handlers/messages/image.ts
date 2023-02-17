import { ImageEventMessage, MessageEvent } from '@line/bot-sdk'

import { errorLogger } from '~/utils/util'

export const messageImageHandler = async (event: MessageEvent): Promise<void> => {
  try {
    const { id } = event.message as ImageEventMessage

    console.info(id)
  } catch (err) {
    errorLogger(err)
    throw new Error('message image handler')
  }
}
