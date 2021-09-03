// 分析器
interface Course {
  title: string | undefined,
  img: string | undefined,
}

interface Content {
  time: number,
  data: Course []  // 代表数组 数组中每一项是对象
}

interface innerContent {
  // propName属性名 类型number
  [propName:number]: Course[]
}

import cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import { Analyzer } from './crowller'
const request = require('request');

// implements 也是继承
export default class DellAnalyzer implements Analyzer {

  // 使用单例模式 改造类
  private static instance: DellAnalyzer;
  static getInstance () {
    if( !DellAnalyzer.instance){
      // 单例
      DellAnalyzer.instance = new DellAnalyzer();
    }
    return  DellAnalyzer.instance
  }


  // 分析内容
  getCourseInfo( html: string) {
      // console.log("pic",title)
    const courseInfos: Course[] = [];
    const $ = cheerio.load(html)
    const pic = $('.il_img') //图片dom
    pic.map( (index,ele) => {
      const title = '图片'
      const img = $(ele).find('img').attr('src')
      const obj: Course = {
        title,
        img,
      }
      courseInfos.push(obj)
    })
    const result: Content = {
      data: courseInfos,
      time: new Date().getTime()
    }
    return result
  }

  // 存储内容
  generateJsonContent(content:Content,filePath:string) {
    let fileContent: innerContent = {};
    // 下载图片
    this.downloadImg(content)
    if(fs.existsSync(filePath)) {
      // 判断文件是否存在
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    fileContent[content.time] = content.data
    return fileContent
  }


  
  // 下载图片
  downloadImg(res:Content) {
    const imgSrc= res.data
    imgSrc.map ( async item => {
      const title:number = new Date().getTime()
      const pathJoin = path.join(__dirname,`../image/${title}.png`)
      let stream = fs.createWriteStream(pathJoin);
        request( `http:${item.img}`).pipe(stream).on("close", function () {
        });
    }) 
  }
  public analyze (html:string,filePath:string) {
    const content =  this.getCourseInfo(html)  //处理抓取的信息
    const fileContent = this.generateJsonContent(content,filePath)  //下载图片
   
    return JSON.stringify(fileContent)
  }

}