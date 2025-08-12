gxpt 项目打包部署说明（宝塔）
========================

1) 文件结构（解压后）
- backend/        后端 Node.js 程序（端口 3000）
- public/         前端静态页面（上传到你的网站根目录）
- sql/init.sql    数据库初始化（包含数据库与用户创建）
- start.sh        一键部署脚本（安装依赖并启动服务）

2) 上传与解压
把 gxpt_deploy.zip 上传到宝塔文件管理，解压到 /www/wwwroot/gxpt 或你希望的位置。

3) 初始化数据库（以 root 用户执行）
在服务器终端运行：
  mysql -u root -p < /path/to/sql/init.sql
（会创建数据库 gxpt_platform 和数据库用户 gxpt_user，密码为生成的强密码）

4) 启动后端（推荐在宝塔终端执行）
进入解压后的目录，执行：
  bash start.sh

start.sh 会安装依赖并用 pm2 启动后端进程。

5) 配置站点与反向代理（把域名绑定到前端）
- 在宝塔添加网站：域名 gxpt.wendong.work，根目录指向 public/ 的位置（例如 /www/wwwroot/gxpt/public）
- 在该站点 Nginx 配置中添加反向代理，把 /api/ 转发到 http://127.0.0.1:3000/api/

Nginx 反代示例（加入到站点额外配置）：
location /api/ {
  proxy_pass http://127.0.0.1:3000/api/;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

6) 访问测试
- 前端页面: https://gxpt.wendong.work
- 健康检查: https://gxpt.wendong.work:3000/api/health
- 注册: POST https://gxpt.wendong.work:3000/api/auth/register  body: {username,password}
- 登录: POST https://gxpt.wendong.work:3000/api/auth/login  body: {username,password}

7) 注意
- 安全：请在生产环境更改 JWT_SECRET 环境变量（默认在代码里为占位）。
- 如果你的服务器没有 SSL，建议在宝塔网站里申请 Let's Encrypt 证书并启用 HTTPS。

数据库账号信息（init.sql 创建）：
- 数据库：gxpt_platform
- 用户：gxpt_user
- 密码：kH8x!pZ3R@tq
