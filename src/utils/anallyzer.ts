import cheerio from 'cheerio'
import fs from 'fs'
import { AnalyzerType } from './crowller'

interface List {
  title: string;
  authorName: string;
  date: string;
  content: string;
  url: string;
  imgUrl: string
}

interface PostResult {
  time: number;
  data: List[]
}

interface Content {
  [propName: number]: List[]
}

export default class Analyzer implements AnalyzerType {

  private static instance: Analyzer

  static getInstance() {
    if (!Analyzer.instance) {
      Analyzer.instance = new Analyzer()
    }
    return Analyzer.instance
  }

  private getJsonInfo(html: string) {
    const list: List[] = []
    const $ = cheerio.load(html)
    const items = $('.j_thread_list')
    items.map((index, item) => {
      const title = $(item).find('.j_th_tit ').eq(0).text().replace(/[\r\n]/g,"").replace(/\s+/g, "")
      const authorName = $(item).find('.tb_icon_author').attr('title')?.split('主题作者: ')[1] || ''
      const date = $(items).find('.threadlist_reply_date').eq(0).text().replace(/[\r\n]/g,"").replace(/\s+/g, "")
      const content = $(items).find('.threadlist_abs').eq(index).text().replace(/[\r\n]/g,"").replace(/\s+/g, "") || '默认内容'
      const url = `https://tieba.baidu.com${$(items).eq(index).find('.threadlist_title').find('.j_th_tit ').attr('href')}`
      const imgUrl = $(item).find('img').attr('src') || ''
      list.push({
        title,
        authorName,
        date,
        content,
        url,
        imgUrl
      })
      // console.log('list', list)
    })
    return {
      data: list,
      time: new Date().getTime()
    }
  }

  private generateJsonContent(postResult: PostResult, filePath: string) {
    let fileContent = []
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    // fileContent[postResult.time] = postResult.data
    fileContent = [...postResult.data, ...fileContent]
    return fileContent
  }

  public analyze(html: string, filePath: string) {
    const postResult = this.getJsonInfo(html)
    const fileContent = this.generateJsonContent(postResult, filePath)
    return JSON.stringify(fileContent)
  }

  private constructor () {}
}