import ALY from 'aliyun-sdk'
import refresh from '../src/refresh-cdn'

test('refresh cdn', async () => {
  const spy = jest.spyOn(ALY, 'CDN').mockImplementation(() => ({
    refreshObjectCaches: (option, callback) => {
      callback(null, null)
    }
  }))

  await refresh({
    enabled: true,
    log: true,
    paths: ['http://a.com/', 'https://a.com/'],
    files: ['http://a.com/index.html \nhttps://a.com/index.html']
  })

  spy.mockRestore()
})
