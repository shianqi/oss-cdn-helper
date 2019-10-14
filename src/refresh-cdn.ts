import ALY from 'aliyun-sdk'
import { getEnv } from './utils'
import { RefreshCDNConfig } from './types'

const refreshCDN = (config: RefreshCDNConfig) =>
  new Promise((resolve, reject) => {
    console.log('\nStart Refresh CDN...')
    const cdn = new ALY.CDN({
      accessKeyId: getEnv('ALI_ACCESS_ID'),
      secretAccessKey: getEnv('ALI_ACCESS_KEY'),
      endpoint: 'https://cdn.aliyuncs.com',
      apiVersion: '2014-11-11'
    })

    if (!config.enabled) {
      resolve()
    }

    const pathStr = config.paths.join(' \n')

    cdn.refreshObjectCaches(
      {
        ObjectType: 'Directory',
        ObjectPath: pathStr
      },
      (err: any, res: any) => {
        if (err) {
          reject(err)
        }
        console.log('\nRefresh complete !')
        resolve(res)
      }
    )
  })

export default refreshCDN
