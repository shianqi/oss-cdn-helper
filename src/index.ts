import Uploader from './upload-oss'
import refresh from './refresh-cdn'
import { UploadConfig } from './types'

const upload = (uploadConfig: UploadConfig) => {
  const uploader = new Uploader(uploadConfig)
  return uploader.upload()
}

export default {
  upload,
  refresh
}
