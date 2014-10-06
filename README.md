Imooc
www.imyy.org
=====

慕课网bootstrap+node.js+express+jade+mongodb打造下一代web应用程序。

=====
###架构
 - 前端：bootstrap3.2.0、jQuery 2.1.1 `后面会采用angular做为前端MVC`
 - 后端：node.js、express、jade、mongoose
 - 数据库：mongoDB


------------------------------------
### 本地开发和运行

1. 安装 [nodejs](http://nodejs.org) 环境和 [npm](https://www.npmjs.org)，具体方法请自行参考其官网文档。
2. 在项目根目录依次执行 `npm install` 和 `bower install`安装依赖项，然后执行 `grunt` 即可启动开发服务器并调用系统浏览器打开 <http://localhost:3000>。
3. 默认数使用的 MongoDB 服务器地址为 `mongodb://localhost/imooc`

#### 各个模块路由地址

 >**首页**：[http://localhost:3000/](http://localhost:3000/)

 >**详细页面**：[http://localhost:3000/movie/:id](http://localhost:3000/movie/:id)

 >**后台列表页**：[http://localhost:3000/admin/list](http://localhost:3000/admin/list)

 >**后台添加页**：[http://localhost:3000/admin/movie](http://localhost:3000/admin/movie)

 >**后台编辑页**：[http://localhost:3000/admin/update/:id](http://localhost:3000/admin/update/:id)

--------------------------