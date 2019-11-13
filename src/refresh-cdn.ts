import ALY from 'aliyun-sdk'
import { getEnv } from './utils'
import { RefreshCDNConfig } from './types'

const refresh = (
  cdn: any,
  paths: string[],
  type: ('Directory' | 'File')
) => new Promise((resolve, reject) => {
  const fileStr = paths.join(' \n')

  cdn.refreshObjectCaches(
    {
      ObjectType: type,
      ObjectPath: fileStr
    },
    (err: any, res: any) => {
      if (err) {
        reject(err)
      }
      console.log('\nRefresh files complete !')
      resolve(res)
    }
  )
})

const refreshCDN = async (config: RefreshCDNConfig) => {
  console.log('\nStart Refresh CDN...')
  const cdn = new ALY.CDN({
    accessKeyId: getEnv('ALI_ACCESS_ID'),
    secretAccessKey: getEnv('ALI_ACCESS_KEY'),
    endpoint: 'https://cdn.aliyuncs.com',
    apiVersion: '2014-11-11'
  })

  if (!config.enabled) {
    return
  }

  if (config.paths) {
    await refresh(cdn, config.paths, 'Directory')
  }

  if (config.files) {
    await refresh(cdn, config.files, 'File')
  }
}

export default refreshCDN
