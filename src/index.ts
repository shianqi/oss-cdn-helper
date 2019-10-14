import Uploader from './upload-oss'
import refresh from './refresh-cdn'
import { UploadConfig } from './types'

const upload = async (uploadConfig: UploadConfig) => {
  const uploader = new Uploader(uploadConfig)
  await uploader.upload()
}

export default {
  upload,
  refresh
}
