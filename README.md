## oss-cdn-helper

将静态资源上传到 OSS，并且可以去掉 html 文件的 `.html` 后缀，并修改 `Content-Type` 为 `text/html` 达到可以用 `/example` 代替 `/example.html` 访问网页的效果

1. 安装相关依赖：

    ```bash
    npm install oss-cdn-helper --save-dev
    ```

1. 部署并刷新 CDN

    ```javascript
    import path from 'path'
    import OssCdnHelper from 'oss-cdn-helper'

    const process = async () => {
      await OssCdnHelper.upload({
        uploadPath: path.resolve(__dirname, '../build'),
        targetPath: '/target',
        region: 'oss-cn-beijing',
        bucket: 'tp-hansel-dev',
        removeHtmlSuffix: true,
        removeHtmlSuffixIgnore: [],
        cleanTargetPath: false
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

## 参数

```javascript
await OssCdnHelper.upload({
  uploadPath: path.resolve(__dirname, '../build'), // 要上传的文件夹，绝对路径
  targetPath: '/target',                           // 上传到 OSS 上文件夹的位置
  region: 'oss-cn-beijing',                        // OSS 位置
  bucket: 'tp-hansel-dev',                         // bucket 名称
  removeHtmlSuffix: true,                          // 是否去掉 .html 后缀上传
  removeHtmlSuffixIgnore: [],                      // 忽略去掉 .html 后缀的路径
  cleanTargetPath: false                           // 上传前是否先清空 OSS 上的目标文件夹（暂时无效）
})

await OssCdnHelper.refresh({
  enabled: true,                                   // 是否刷新 CDN
  paths: [                                         // 要刷新的 CDN 的 URL 地址
    'http://www.baidu.com/public/',
    'https://www.baidu.com/public/'
  ]
})
```

## TODO

* 上传前清空目标文件夹
