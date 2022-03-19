import superagent from 'superagent'
import fs from 'fs'
import path from 'path'
// import Analyzer from './anallyzer'

export interface AnalyzerType {
  analyze: (html: string, filePath: string) => string;
}

class Crowller {

  constructor(private url: string, private analyzer: AnalyzerType) {
    this.initSpiderProcess()
  }

  // private secret = 'secretKey'
  // private url = 'https://tieba.baidu.com/f?kw=%E5%AD%99%E7%AC%91%E5%B7%9D'
  private rawHtml = ''
  private filePath = path.resolve(__dirname, '../../data/post.json')

  async getRawHtml() {
    const result = await superagent.get(this.url)
    return result.text
  }

  writeFile(content: string) {
    fs.writeFileSync(this.filePath, content)
  }

  async initSpiderProcess() {
    const html = await this.getRawHtml()
    const fileContent = this.analyzer.analyze(html, this.filePath)
    this.writeFile(fileContent)
  }

}

export default Crowller
