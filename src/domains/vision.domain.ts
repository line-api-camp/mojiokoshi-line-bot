import { ImageAnnotatorClient } from '@google-cloud/vision'

import { FB_PROJECT_ID, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } from '~/utils/secrets'

const vision = new ImageAnnotatorClient({
  credentials: {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
  },
  projectId: FB_PROJECT_ID
})

export const imageToText = async (imageBuffer: Buffer): Promise<string | null> => {
  const result = await vision
    .textDetection({ image: { content: imageBuffer } })
    .then((results) => results[0])

  if (!result.fullTextAnnotation || !result.fullTextAnnotation.text) {
    return null
  }

  return result.fullTextAnnotation.text
}
