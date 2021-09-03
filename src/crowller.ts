// ts ->.d.ts 翻译文件 @types/superagent -> js
// superagent ajax nodejs 网络请求工具
// cheerio cheerio是jquery核心功能的一个快速灵活而又简洁的实现，主要是为了用在服务器端需要对DOM进行操作的地方
import superagent from 'superagent'
import fs from 'fs'
import DellAnalyzer from './dellAnalyzer'

import path from 'path'

// 定义类型
export interface Analyzer {
  analyze: ( html: string, filePath: string ) => string
}

class Crowller {
  // private  不允许外部调用
  private filePath = path.resolve(__dirname,'../data/content.json')
  constructor(private url:string, private analyzer: Analyzer) {
    this.initSpiderProcess()
  }

  private async getRawHtml () {
    // 获取html
    const result = await superagent.get(this.url)
    return result.text
  }

  // 写文件
  private writeFile(content:string) {
    fs.writeFileSync(this.filePath, content)  //处理写文件
  }

  // 初始化
  private async initSpiderProcess() {
    const html = await this.getRawHtml()  //初始化html
    const fileContent = this.analyzer.analyze(html,this.filePath)
    this.writeFile(fileContent)
  }
 
} 

var i  = 1
setInterval( () => {
  const url_s = `https://www.ivsky.com/tupian/meinv_t50/index_${i}.html`
  const analyzer = DellAnalyzer.getInstance()
  new Crowller(url_s, analyzer)
  i++
},5000) 



