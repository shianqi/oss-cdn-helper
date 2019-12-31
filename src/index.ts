import Uploader from './upload-oss'
import { UploadConfig } from './types'
export { default as refresh } from './refresh-cdn'

export const upload = (uploadConfig: UploadConfig) => {
  const uploader = new Uploader(uploadConfig)
  return uploader.upload()
}
