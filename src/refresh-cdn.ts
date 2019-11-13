import ALY from 'aliyun-sdk'
import { getEnv } from './utils'
import { RefreshCDNConfig } from './types'

enum RefreshObjectType {
  Directory = 'Directory',
  File = 'File'
}

const refresh = (
  cdn: any,
  config: RefreshCDNConfig,
  type: RefreshObjectType
) => new Promise((resolve, reject) => {
  let paths
  if (
    type === RefreshObjectType.Directory
      && config.paths
      && config.paths.length
  ) {
    paths = config.paths
  } else if (
    type === RefreshObjectType.File
      && config.files
      && config.paths.length
  ) {
    paths = config.files
  } else {
    resolve()
  }

  const fileStr = paths.join('\n')

  cdn.refreshObjectCaches(
    {
      ObjectType: type,
      ObjectPath: fileStr
    },
    (err: any, res: any) => {
      if (err) {
        reject(err)
      }

      if (config.log) {
        console.log(`\n${type}:\n${fileStr}\n`)
      }

      console.log(`\nRefresh ${type} complete !`)
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

  await refresh(cdn, config, RefreshObjectType.Directory)
  await refresh(cdn, config, RefreshObjectType.File)
}

export default refreshCDN
