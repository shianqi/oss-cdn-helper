export interface UploadConfig {
  removeHtmlSuffix: boolean //
  removeHtmlSuffixIgnore: string[]
  cleanTargetPath: boolean // 清空上传目标文件夹
  uploadPath: string // 本地待上传文件夹
  targetPath: string // 上传目标文件夹
  bucket: string //
  region: string // 外网 oss-cn-hangzhou 内网 oss-cn-hangzhou-internal
}

export interface RefreshCDNConfig {
  enabled: boolean
  paths: string[]
}
