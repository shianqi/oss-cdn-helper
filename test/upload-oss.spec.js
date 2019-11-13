import Uploader from '../src/upload-oss'
import path from 'path'

const uploader = new Uploader({
  uploadPath: './build',
  targetPath: '/target',
  region: 'oss-cn-beijing',
  bucket: 'tp-hansel-dev',
  removeHtmlSuffix: true,
  removeHtmlSuffixIgnore: ['index.html'],
  cleanTargetPath: false,
})

test('getFileName', async () => {
  expect(uploader.getFileName('index.html')).toEqual('index.html')
  expect(uploader.getFileName('main.html')).toEqual('main')
})

test('getUploadOption', async () => {
  const filePath = path.resolve(__dirname, './build/index.html')
  const uploadOption = await uploader.getUploadOption('index.html', filePath)
  expect(uploadOption).toEqual({
    fileName: 'index.html',
    filePath,
    md5: '0ED4229A5D4F84FCC6E95A82CB4C10CE',
    option: {
      headers: {
        'Content-Type': 'text/html'
      }
    }
  })
})

test('getUploadOption', async () => {
  const filePath = path.resolve(__dirname, './build/utils/index.js')
  const uploadOption = await uploader.getUploadOption('utils/index.js', filePath)
  expect(uploadOption).toEqual({
    fileName: 'utils/index.js',
    filePath,
    md5: 'AF910CB083A78FE2F5AFAEEC4D859225'
  })
})

test('getUploadOption', async () => {
  const filePath = path.resolve(__dirname, './build/main.html')
  const uploadOption = await uploader.getUploadOption('main.html', filePath)
  expect(uploadOption).toEqual({
    fileName: 'main',
    filePath,
    md5: 'AC285444A0D0D07C48162846CB6BB93C',
    option: {
      headers: {
        'Content-Type': 'text/html'
      }
    }
  })
})

test('getUploadOption', async () => {
  const filePath = path.resolve(__dirname, './build/main.js')
  const uploadOption = await uploader.getUploadOption('main.js', filePath)
  expect(uploadOption).toEqual({
    fileName: 'main.js',
    filePath,
    md5: '3FB53F8A1EF4D8592D03BAA8BB6ABB93'
  })
})

test('uploadFolder', async () => {
  expect(uploader.uploadList).toEqual([])
  const spy = jest.spyOn(uploader, 'isExist').mockImplementation(() => {
    return false
  })

  await uploader.uploadFolder({
    uploadPath: path.resolve(__dirname, './build'),
    targetPath: '/target'
  })

  spy.mockRestore()

  expect(uploader.uploadList).toEqual([
    {
      fileName: "/target/index",
      filePath: path.resolve(__dirname, './build/index.html'),
      option:  {
        "headers":  {
          "Content-Type": "text/html"
        }
      }
    },
    {
      "fileName": "/target/main",
      "filePath": path.resolve(__dirname, './build/main.html'),
      "option":  {
        "headers":  {
          "Content-Type": "text/html"
        }
      }
    },
    {
      "fileName": "/target/main.js",
      "filePath": path.resolve(__dirname, './build/main.js'),
      "option": undefined
    },
    {
      "fileName": "/target/utils/index.js",
      "filePath": path.resolve(__dirname, './build/utils/index.js'),
      "option": undefined
    }
  ])
})
