import { Router, Request, Response, NextFunction } from "express"
import fs from 'fs'
import path from 'path'
import Crowller from './utils/crowller'
import Analyzer from './utils/anallyzer'
import { getResponseData } from "./utils"

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined
  }
}

const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false
  if (isLogin) {
    next()
  } else {
    res.json(getResponseData<boolean>(false, '请先登录'))
  }
}

const router = Router()

router.get('/', (req: Request, res: Response) => {
  const isLogin = req.session ? req.session.login : false
  if (isLogin) {
    res.send(`
     <html>
      <body>
        <a href="/getData">爬取数据</a>
        <a href="/logout">退出</a>
      </body>    
    </html>
    `)
  } else {
    res.send(`
     <html>
       <body>
         <form method="post" action="/login">
           <input type="password" name="password" />
           <button type="submit">提交</button>
         </form>
       </body>
     </html>
  `)
  }
})

router.get('/api/logout', (req: Request, res: Response) => {
  if (req.session) {
    req.session.login = undefined
  }
  res.redirect('/')
})

router.get('/api/isLogin', (req: Request, res: Response) => {
  const isLogin = req.session ? req.session.login : false
  const result = getResponseData<boolean>(isLogin)
  res.json(result)
})

router.post('/api/login', (req: RequestWithBody, res: Response) => {
  const { password } = req.body
  const isLogin = req.session ? req.session.login : false
  console.log('isLogin', isLogin)
  if (isLogin) {
    res.json(getResponseData<boolean>(true))
  } else {
    if (password === '123' && req.session) {
      req.session.login = true
      res.json(getResponseData<boolean>(true))
    } else {
      res.json(getResponseData<boolean>(false, 'fail'))
    }
  }
  
})

router.get('/api/getData', checkLogin, (req: RequestWithBody, res: Response) => {
  const url = 'https://tieba.baidu.com/f?kw=%E5%AD%99%E7%AC%91%E5%B7%9D'
  const analyzer = Analyzer.getInstance()
  new Crowller(url, analyzer)
  res.json(getResponseData<boolean>(true))
})

router.get('/api/showData', checkLogin, (req: RequestWithBody, res: Response) => {
  try {
    const filePath = path.resolve(__dirname, '../data/post.json')
    const result = fs.readFileSync(filePath, 'utf-8')
    res.json(getResponseData(JSON.parse(result)))
  } catch (error) {
    res.json(getResponseData<boolean>(false, '获取数据失败'))
  }
})

export default router
