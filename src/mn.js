const puppeteer = require('puppeteer');
const {
  mn
} = require('./config/default');
const srcToImg = require('./helper/srcTolmg');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://image.baidu.com/');
  console.log('前往 百度图片');

  // 更改浏览器窗口大小, 获取足够多的图片数量
  await page.setViewport({
    width: 1920,
    height: 2080
  });

  // 步骤: 编辑框焦点, 键盘输入, 鼠标点击
  await page.focus('#kw');
  await page.keyboard.sendCharacter('抖音小姐姐');
  await page.click('.s_search');
  console.log('搜索列表页');

  page.on('load', async () => {
    console.log('资源列表加载完成, 等待抓取');

    const srcs = await page.evaluate(() => {
      const images = document.querySelectorAll('img.main_img');
      return Array.prototype.map.call(images, img => img.src);
    })
    console.log(`获取${srcs.length} 张图片, 开始下载...`)

    srcs.forEach(async src => {
      // 反反爬虫 sleep
      await page.waitFor(200)
      await srcToImg(src, mn);
    })

    await browser.close();
  })
})()