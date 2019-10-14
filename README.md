## oss-cdn-helper

1. 安装相关依赖：

```bash
npm install oss-cdn-helper --save-dev
```

2. 

```javascript
import OssCdnHelper from 'oss-cdn-helper'

const process = async () => {
  await OssCdnHelper.upload({
    uploadPath: '../build',
    targetPath: '/target',
    region: 'oss-cn-beijing',
    bucket: 'tp-hansel-dev',
    removeHtmlSuffix: true,
    removeHtmlSuffixIgnore: [],
    cleanTargetPath: false,
  })
  await OssCdnHelper.refresh({
    enabled: true,
    paths: [
      'http://www.baidu.com/public/',
      'https://www.baidu.com/public/'
    ]
  })
}

process()
```
