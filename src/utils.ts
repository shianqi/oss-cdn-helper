import crypto from 'crypto'
import fs from 'fs'

export const getFileMd5: (filePath: string) => Promise<string> = filePath =>
  new Promise(resolve => {
    const stream = fs.createReadStream(filePath)
    const hash = crypto.createHash('md5')

    stream.on('data', function (d) {
      hash.update(d)
    })

    stream.on('end', function () {
      const md5 = hash.digest('hex')
      resolve(md5.toString().toUpperCase())
    })
  })

export const getEnv: (key: string, defaultValue?: string) => string = (
  key,
  defaultValue
) => process.env[key] || defaultValue || ''
