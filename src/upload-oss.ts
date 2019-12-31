import path from 'path'
import fs from 'fs'
import OSS from 'ali-oss'
import ProgressBar from 'progress'
import { getEnv, getFileMd5 } from './utils'
import { UploadConfig } from './types'

interface uploadFolderOptions {
  uploadPath: string
  targetPath: string
}

class Uploader {
  store: any
  uploadList: {
    fileName: string
    filePath: string
    option: {}
  }[]

  bar?: ProgressBar
  uploadConfig: UploadConfig

  constructor (uploadConfig: UploadConfig) {
    const { bucket, region } = uploadConfig

    this.uploadConfig = uploadConfig
    this.uploadList = []

    this.store = new OSS({
      accessKeyId: getEnv('ALI_ACCESS_ID'),
      accessKeySecret: getEnv('ALI_ACCESS_KEY'),
      bucket,
      region,
      internal: false
    })
  }

  async isExist (path: string, md5: string) {
    let isExist = true

    try {
      const { res } = await this.store.head(path)
      const { headers } = res
      const { etag } = headers
      const ossMd5 = etag.replace(/"/g, '')
      if (ossMd5 !== md5) {
        isExist = false
      }
    } catch (error) {
      isExist = false
    }

    return isExist
  }

  getFileName (path: string) {
    const { removeHtmlSuffixIgnore } = this.uploadConfig
    if (removeHtmlSuffixIgnore.includes(path)) {
      return path
    }
    return path.replace('.html', '')
  }

  async getUploadOption (originName: string, originPath: string) {
    const { removeHtmlSuffix } = this.uploadConfig
    if (removeHtmlSuffix && originName.match(/.html$/)) {
      const fileName = this.getFileName(originName)
      return {
        fileName,
        filePath: originPath,
        option: {
          headers: {
            'Content-Type': 'text/html'
          }
        },
        md5: await getFileMd5(originPath)
      }
    } else {
      return {
        fileName: originName,
        filePath: originPath,
        md5: await getFileMd5(originPath)
      }
    }
  }

  async uploadFolder (options: uploadFolderOptions) {
    const { uploadPath, targetPath } = options

    const names = fs.readdirSync(uploadPath)
    for (const name of names) {
      const filepath = path.resolve(uploadPath, name)

      let suffixPath

      if (/\/$/.test(targetPath)) {
        suffixPath = `${targetPath}${name}`
      } else {
        suffixPath = `${targetPath}/${name}`
      }

      if (fs.statSync(filepath).isFile()) {
        const uploadOption = await this.getUploadOption(suffixPath, filepath)
        const { fileName, filePath, option, md5 } = uploadOption

        const isExist = await this.isExist(suffixPath, md5)

        if (!isExist) {
          this.uploadList.push({
            fileName,
            filePath,
            option
          })
        }
      } else {
        await this.uploadFolder({
          uploadPath: filepath,
          targetPath: suffixPath
        })
      }
    }
  }

  async upload () {
    const { uploadPath, targetPath } = this.uploadConfig
    const absoluteUploadPath = path.resolve(__dirname, uploadPath)

    console.log(
      `Upload new static resource to ${JSON.stringify(this.uploadConfig)}`
    )
    console.log(`Folder path: ${absoluteUploadPath}`)

    await this.uploadFolder({
      uploadPath: absoluteUploadPath,
      targetPath
    })
    this.bar = new ProgressBar(':bar :current /:total :percent', {
      total: this.uploadList.length
    })
    await Promise.all(
      this.uploadList.map(({ fileName, filePath, option }) => {
        return this.store.put(fileName, filePath, option).then(() => {
          this.bar.tick()
        })
      })
    )
    console.log('\nUpload complete !')
    return this.uploadList
  }

  clean () {
    console.log('Clean OSS files...')
    console.log('Clean complete')
  }
}

export default Uploader
