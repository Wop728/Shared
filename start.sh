#!/usr/bin/env bash
set -e
echo "一键部署脚本 - 将进行：安装依赖、导入数据库（需要 MySQL root 权限）、启动服务（pm2 推荐）"
CURDIR="$(cd "$(dirname "$0")" && pwd)"
cd "$CURDIR/backend"

echo "安装依赖..."
npm install --registry=https://registry.npmmirror.com

echo "请使用 MySQL root 用户运行以下命令导入数据库（脚本不会自行输入 root 密码）:"
echo "mysql -u root -p < ../sql/init.sql"
read -p "如果你已手动运行上面导入命令，按回车继续..." dummy

echo "启动服务（推荐使用 pm2）..."
if ! command -v pm2 >/dev/null 2>&1; then
  echo "pm2 未安装，正在全局安装 pm2..."
  npm install -g pm2
fi

pm2 delete gxpt-backend || true
pm2 start app.js --name gxpt-backend
pm2 save

echo "完成。后端运行在端口 3000。前端请放到站点根目录并将 API 指向 https://gxpt.wendong.work:3000/api"
