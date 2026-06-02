### 🚀[am-cf-tunnel-sub](https://github.com/amclubs/am-cf-tunnel-sub)
基于Vercel、Cloudflare部署该脚本，你可以方便地将Cloudflare Workers 和 Pages的 VLESS、Trojan 配置信息使用在线配置转换到 Clash、 Singbox 、Quantumult X等工具中订阅使用。Cloudflare Workers 和 Pages 生成VLESS、Trojan节点,实现一键订阅节点。分离节点与订阅框架,更好解决Cloudfare部署时出现1101、522的问题。支持在线优选IP功能。 [最新视频教程](https://youtu.be/f8ZTvv4u3Pw)、[🎬 YouTube](https://youtube.com/@am_clubs?sub_confirmation=1)、 [💬 Telegram](https://t.me/am_clubs)、[📂 GitHub](https://github.com/amclubs)、[🌐 Blog](https://amclubss.com)

### ⚙️结合Coudflare部署免费节点项目 [am-cf-tunnel](https://github.com/amclubs/am-cf-tunnel) 与教程使用 [部署视频教程](https://youtu.be/e1Lvo5F37vk)
- 本频道订阅器转换地址：https://sub.amclubss.com

### 👉 后期计划
- 增加其它更多免费容器部署

<div align="center" markdown="1">
  <a href="https://doloffer.com/friend/xm5ydFi1">
    <img alt="doloffer" style="width:900px;max-width:100%;height:300px;" src="example/doloffer_ad.jpg">
  </a><br>
  <a href="https://doloffer.com/friend/xm5ydFi1"><b>Doloffer🔥全网超划算的 ChatGPT Plus / Claude Pro 充值平台｜官方正版订阅｜独立账号・共享车位｜稳定续费・售后无忧｜低成本畅享顶级 AI 工具</b></a>
</div>

- 🎁专属9折优惠码：AI8888（全场通用）🔗 立即前往：👉 [Doloffer官方网站](https://doloffer.com/friend/xm5ydFi1) ｜ 📖 [Doloffer Guide](https://github.com/Doloffer-g/guide)


##
### 📝一、前期准备资料
<details>
<summary>点击展开/收起</summary>

### 1、注册免费**Vercel**帐号(GitHub方式连接就可以注册)
- 注册地址：https://vercel.com <a href="https://www.youtube.com/watch?v=ZxHLLlxuJyI&t=50s">[点击观看视频教程]</a>

### 2、注册**免费域名** [点击观看所有免费域名视频教程](https://www.youtube.com/playlist?list=PLGVQi7TjHKXZGODTvB8DEervrmHANQ1AR)

### 3、**订阅工具** [点击观看使用视频教程](https://youtu.be/xGOL57cmvaw)
👉 [点击加入TG群 数字套利｜交流群](https://t.me/AM_CLUBS)发送关键字 **工具** 获取下载

### 4、Cloudflare标准 **端口** 知识  [点击观看优选IP视频教程](https://youtu.be/pKrlfRRB0gU)
- 80系端口(HTTP)：80，8080，8880，2052，2082，2086，2095
- 443系端口(HTTPS)：443，2053，2083，2087，2096，8443
- [IP落地测试工具地址](https://ip.sb/)

### 4、结合loudflare部署免费节点项目与教程使用 [am-cf-tunnel](https://github.com/amclubs/am-cf-tunnel)

</details>

## 
## ⚙️ 二、部署节点订阅器 [Vercel部署视频教程](https://www.youtube.com/playlist?list=PLGVQi7TjHKXZGODTvB8DEervrmHANQ1AR) [Cloudfare部署视频教程](https://youtu.be/f8ZTvv4u3Pw)

#### `①` Vercel方式部署 [视频教程](https://www.youtube.com/watch?v=i-XnnP-MptY&t=596s)
<details>
<summary>点击展开/收起</summary>

1. Fork或克隆本仓库[am-cf-tunnel-sub](https://github.com/amclubs/am-cf-tunnel-sub)到您的 GitHub/GitLab 账户
2. 登录 [Vercel](https://vercel.com)，点击"New Project" <a href="https://www.youtube.com/watch?v=ZxHLLlxuJyI&t=28s">[点击观看注册视频教程]</a>
3. 导入您的仓库，使用默认设置
4. **⚠️ 重要：在"Settings" > "Environment Variables"中添加 `UUID` 和 `HOST` 变量（必须设置）**
5. 点击"Deploy"

访问 `http://部署域名` 即可。
</details>

#### `②` Cloudfare Workers 部署方法 [视频教程](https://www.youtube.com/watch?v=D4XqeRNm2JI&t=501s)
<details>
<summary>点击展开/收起</summary>

1. 部署 Cloudflare Worker：
   - 在 CloudFlare主页的左边菜单的 `计算和AI` 选项卡 -> 点击 `Workers 和 Pages` -> 右上方点击 -> `创建应用程序` -> 选择 `Workers`里的 `从 Hello World! 开始` 点击 `开始使用` -> 填入 `Worker 名称`(此名称自己命名) 后 -> 右下方点击 `部署` 后-> 右上方点击 `断续处理项目`。(此步已有可忽略)。
2. 设置节点UUID和HOST变量： 
   - 在 Workers控制台的 `设置` 选项卡 -> 点击 `设置` -> 左方点击 `变量和机密` -> 右方点击  `添加` -> 变量名称 填入 `UUID`(此名称固定不能变) ，值填入CF部署节点ID -> 再点击添加变量 填入 `HOST`(此名称固定不能变)，值填入CF部署的自定义域名 后 -> 右下方点击 `保存` 即可。
3. 部署 Cloudflare Worker代码：
   - 在 workers控制台的 右上角方点击 `编辑代码(</>)` 图标进入代码编辑页面。
   - 将 [_worker.src.js](https://github.com/amclubs/am-cf-tunnel-sub/blob/main/_worker.src.js) 的内容粘贴到 Worker 编辑器中 右上方点击 -> `部署` 完成部署。
4. 给 workers绑定 自定义域： [免费域名申请教程](https://www.youtube.com/playlist?list=PLGVQi7TjHKXZGODTvB8DEervrmHANQ1AR)
   - 在 workers控制台的 `设置` 选项卡 -> 点击 `域和路由` -> 右方点击 -> `添加` -> 选择 `自定义域`。
   - 填入你已转入 CloudFlare 域名 (amclubss.com) 解析服务的次级域名，例如:`sub.amclubss.com`后 点击 `添加域`，等待证书生效即可。
5. 验证部署是否成功：
   - 访问 `https://[YOUR-WORKERS-URL]` 即可进入登录页面,登录成功就是完成部署(默认登录密码(UUID)是：ec872d8f-72b0-4a04-b612-0327d85e18ed)。
   - 例如 `https://sub.amclubss.com` 然后进入登录页面 -> 输入密码 `ec872d8f-72b0-4a04-b612-0327d85e18ed` -> 点击登录 -> 成功登录。 
6. 修改默认登录密码(ID)变量，(强烈要求修改，防止别人用你节点)： 
   - 在 Worker代码控制台的 `设置` 选项卡 -> 点击 `设置` -> 左方点击 `变量和机密` -> 右方点击  `添加` -> 变量名称 填入 `ID`(此名称固定不能变) ，自己设置复杂的密码 -> 右下方点击 `保存` 即可。
   - 保存成功后，原登录密码(ID)已作废不能访问，用新登录密码(ID)登录访问即可。
7. 增加优选IP(ips)变量，**(要在线优选功能必须配置)**： 
   - 在 CloudFlare主页的左边菜单的 `存储和数据库` 选项卡 -> 展开选择点击 `Workers KV` -> 右方点击 -> `创建实例(Create Instance)` -> 填入 `命名空间名称`(此名称自己命名) 后 -> 点击 `创建`。(此步已有可忽略)
   - 在 Pages控制台的 `设置` 选项卡 -> 点击 `绑定` -> 右方点击 -> `添加` -> 选择 `KV 命名空间` -> 变量名称 填入 `ips`(此名称固定不能变) -> KV 命名空间 选择 在上面创建的 `命名空间名称`后 -> 右下方点击 `保存` 即可。
8. 本频道订阅器转换地址：https://sub.amclubss.com

</details>

#### `③` Cloudfare Pages 上传 部署方法 **(最佳推荐!!!)** [视频教程](https://www.youtube.com/watch?v=D4XqeRNm2JI&t=982s)
<details>
<summary>点击展开/收起</summary>

1. 部署 Cloudflare Pages：
   - 下载 [_worker.src.js.zip](https://raw.githubusercontent.com/amclubs/am-cf-tunnel-sub/main/_worker.src.js.zip) 文件，并点上 Star !!!
   - 在 CloudFlare主页的左边菜单的 `计算(Workers)` 选项卡 -> 点击 `Workers 和 Pages` -> 右上方点击 -> `创建应用程序` -> 选择 `Pages`里的 `拖放文件` 点击 `开始使用` -> 填入 `项目名称`(此名称自己命名)后 -> 右边点击 `创建项目` 后 -> 下方 `上传您的项目资产` 点击 `拖放或从计算机中选择` 后  -> 点击 `上传压缩文件` 然后上传你下载好的 [_worker.src.js.zip](https://raw.githubusercontent.com/amclubs/am-cf-tunnel-sub/main/_worker.src.js.zip) 文件后点击 `部署站点`。
2. 设置节点UUID和HOST变量： 
   - 在 Pages控制台的 `设置` 选项卡 -> 点击 `设置` -> 左方点击 `变量和机密` -> 右方点击  `添加` -> 变量名称 填入 `UUID`(此名称固定不能变) ，值填入CF部署节点ID -> 再点击添加变量 填入 `HOST`(此名称固定不能变)，值填入CF部署的自定义域名 后 -> 右下方点击 `保存`。
   - 在 `设置` 选项卡，点击 `部署` -> 在所有部署 找到最新一条部署记录 ，在右边点击 3个点 `...` 选择 `重试部署` 即可。
3. 给 Pages绑定 CNAME自定义域：[无域名绑定Cloudflare部署视频教程]->[免费域名教程1](https://youtu.be/wHJ6TJiCF0s) [免费域名教程2](https://youtu.be/yEF1YoLVmig)  [免费域名教程3](https://www.youtube.com/watch?v=XS0EgqckUKo&t=320s)
   - 在 Pages控制台的 `自定义域`选项卡，下方点击 `设置自定义域`。
   - 填入你的自定义次级域名，注意不要使用你的根域名，例如：
     您分配到的域名是 `amclubss.com`，则添加自定义域填入 `sub.amclubss.com`即可，点击 `激活域`即可。    
4. 验证部署是否成功：
   - 访问 `https://[YOUR-WORKERS-URL]` 即可进入登录页面,登录成功就是完成部署(默认登录密码(UUID)是：ec872d8f-72b0-4a04-b612-0327d85e18ed)。
   - 例如 `https://sub.amclubss.com` 然后进入登录页面 -> 输入密码 `ec872d8f-72b0-4a04-b612-0327d85e18ed` -> 点击登录 -> 成功登录。 
5. 修改默认登录密码(ID)变量，(强烈要求修改，防止别人用你节点)： 
   - 在 Pages控制台的 `设置` 选项卡 -> 点击 `设置` -> 左方点击 `变量和机密` -> 右方点击  `添加` -> 变量名称 填入 `ID`(此名称固定不能变) ，自己设置复杂的密码 -> 右下方点击 `保存`。
   - 在 `设置` 选项卡，点击 `部署` -> 在所有部署 找到最新一条部署记录 ，在右边点击 3个点 `...` 选择 `重试部署` 即可。
   - 保存成功后，原登录密码(ID)已作废不能访问，用新登录密码(ID)登录访问即可。
6. 增加优选IP(ips)变量，**(要在线优选功能必须配置)**： 
   - 在 CloudFlare主页的左边菜单的 `存储和数据库` 选项卡 -> 展开选择点击 `Workers KV` -> 右方点击 -> `创建实例(Create Instance)` -> 填入 `命名空间名称`(此名称自己命名) 后 -> 点击 `创建`。(此步已有可忽略)
   - 在 Pages控制台的 `设置` 选项卡 -> 点击 `绑定` -> 右方点击 -> `添加` -> 选择 `KV 命名空间` -> 变量名称 填入 `ips`(此名称固定不能变) -> KV 命名空间 选择 在上面创建的 `命名空间名称`后 -> 右下方点击 `保存`。
   - 在 `设置` 选项卡，点击 `部署` -> 在所有部署 找到最新一条部署记录 ，在右边点击 3个点 `...` 选择 `重试部署` 即可。
7. 本频道订阅器转换地址：https://sub.amclubss.com

</details>

#### `④` Cloudfare Pages GitHub 部署方法 **(不推荐)** [视频教程](https://www.youtube.com/watch?v=f8ZTvv4u3Pw&t=137s)
<details>
<summary>点击展开/收起</summary>
   
1. 部署 Cloudflare Pages：
   - 在 Github 上先 Fork 本项目[am-cf-tunnel-sub](https://github.com/amclubs/am-cf-tunnel-sub)，并点上 Star !!!
   - 在 CloudFlare主页的左边菜单的 `计算(Workers)` 选项卡 -> 点击 `Workers 和 Pages` -> 右上方点击 -> `创建应用程序` -> 选择 `Pages`里的 `导入现有 Git 存储库` 点击 `开始使用` -> 选择GitHub 点击`连接GitHub`根据提示授权GitHub和项目(此步已有可忽略)后 -> 选中 `am-cf-tunnel-sub`项目后 -> 点击 `开始设置` -> 可修改`项目名称`(此名称自己命名) 后 -> 右下方点击 `保存并部署`即可。
2. 设置节点UUID和HOST变量： 
   - 在 Pages控制台的 `设置` 选项卡 -> 点击 `设置` -> 左方点击 `变量和机密` -> 右方点击  `添加` -> 变量名称 填入 `UUID`(此名称固定不能变) ，值填入CF部署节点ID -> 再点击添加变量 填入 `HOST`(此名称固定不能变)，值填入CF部署的自定义域名 后 -> 右下方点击 `保存`。
   - 在 `设置` 选项卡，点击 `部署` -> 在所有部署 找到最新一条部署记录 ，在右边点击 3个点 `...` 选择 `重试部署` 即可。
3. 给 Pages绑定 CNAME自定义域：[无域名绑定Cloudflare部署视频教程]->[免费域名教程1](https://youtu.be/wHJ6TJiCF0s) [免费域名教程2](https://youtu.be/yEF1YoLVmig)  [免费域名教程3](https://www.youtube.com/watch?v=XS0EgqckUKo&t=320s)
   - 在 Pages控制台的 `自定义域`选项卡，下方点击 `设置自定义域`。
   - 填入你的自定义次级域名，注意不要使用你的根域名，例如：
     您分配到的域名是 `amclubss.com`，则添加自定义域填入 `sub.amclubss.com`即可，点击 `激活域`即可。    
4. 验证部署是否成功：
   - 访问 `https://[YOUR-WORKERS-URL]` 即可进入登录页面,登录成功就是完成部署(默认登录密码(UUID)是：ec872d8f-72b0-4a04-b612-0327d85e18ed)。
   - 例如 `https://sub.amclubss.com` 然后进入登录页面 -> 输入密码 `ec872d8f-72b0-4a04-b612-0327d85e18ed` -> 点击登录 -> 成功登录。 
5. 修改默认登录密码(ID)变量，(强烈要求修改，防止别人用你节点)： 
   - 在 Pages控制台的 `设置` 选项卡 -> 点击 `设置` -> 左方点击 `变量和机密` -> 右方点击  `添加` -> 变量名称 填入 `ID`(此名称固定不能变) ，自己设置复杂的密码 -> 右下方点击 `保存`。
   - 在 `设置` 选项卡，点击 `部署` -> 在所有部署 找到最新一条部署记录 ，在右边点击 3个点 `...` 选择 `重试部署` 即可。
   - 保存成功后，原登录密码(ID)已作废不能访问，用新登录密码(ID)登录访问即可。
6. 增加优选IP(ips)变量，**(要在线优选功能必须配置)**： 
   - 在 CloudFlare主页的左边菜单的 `存储和数据库` 选项卡 -> 展开选择点击 `Workers KV` -> 右方点击 -> `创建实例(Create Instance)` -> 填入 `命名空间名称`(此名称自己命名) 后 -> 点击 `创建`。(此步已有可忽略)
   - 在 Pages控制台的 `设置` 选项卡 -> 点击 `绑定` -> 右方点击 -> `添加` -> 选择 `KV 命名空间` -> 变量名称 填入 `ips`(此名称固定不能变) -> KV 命名空间 选择 在上面创建的 `命名空间名称`后 -> 右下方点击 `保存`。
   - 在 `设置` 选项卡，点击 `部署` -> 在所有部署 找到最新一条部署记录 ，在右边点击 3个点 `...` 选择 `重试部署` 即可。
7. 本频道订阅器转换地址：https://sub.amclubss.com

</details>

## 
### 🔧三、变量说明 [视频教程](https://www.youtube.com/watch?v=i-XnnP-MptY&t=596s)
| 变量名 | 示例 | 必填 | 备注 | YT |
|-----|-----|-----|-----|-----|
| ID   | ec872d8f-72b0-4a04-b612-0327d85e18ed（默认）|✅| 订阅器的登录密码 | |
| UUID | ec872d8f-72b0-4a04-b612-0327d85e18ed |✅| 支持多节点(多个之间`,`作间隔) Cloudflare部署节点的ID变量值[在线获取UUID](https://1024tools.com/uuid)   |  |
| HOST | vless.amclubss.com |✅| 支持多节点(多个之间`,`作间隔) Cloudflare部署节点的域名或自定域名 | |
| PROT_TYPE        | 默认空          |❌|  默认空,支持多节点(多个之间`,`作间隔) 就是生成vless和trojan节点，vless(只生成vless节点)，trojan(只生成trojan节点)           | [视频教程](https://www.youtube.com/watch?v=emEBm8Gw2wI&t=922s) |
| IP_URL           | [https://raw.github.../ipUrl.txt](https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/example/ipUrl.txt) </br>或</br> [https://raw.github.../ipv4.txt](https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/example/ipv4.txt) |❌| （推荐）优选(ipv4、ipv6、域名、API)地址(支持多个之间`,`或 换行 作间隔)，支持文件连接后里带PROXYIP参数，可以实现不同区域优先IP使用不同的PROXYIP固定区域，解决IP乱跳问题  | [KV存储教程](https://youtu.be/dzxezRV1v-o)[GitHub存储教程](https://youtu.be/vX3U3FuuTT8)[使用教程](https://www.youtube.com/watch?v=4fcyJjstFdg&t=349s)|
| PROXYIP          | proxyip.amclubs.kozow.com </br>或</br> [https://raw.github.../proxyip.txt](https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/example/proxyip.txt)  |❌| 访问CloudFlare的CDN代理节点(支持多PROXYIP, PROXYIP之间使用`,`或 换行 作间隔),支持端口设置默认443 如: proxyip.amclubs.kozow.com:2053 ，支持远程txt或csv文件| [视频教程](https://youtu.be/pKrlfRRB0gU) |
| SOCKS5           | user:password@127.0.0.1:1080         |❌| 优先作为访问CFCDN站点的SOCKS5代理                                                   | [视频教程](https://youtu.be/Bw82BH_ecC4) |
| NAT64           | true/false                           |❌| 默认false,是否开启nat做PROXYIP(反代IP)，开启后优选使用NAT64再用PROXYIP       | [视频教程](https://www.youtube.com/watch?v=nx80sGpVoBM&t=533s) |
| NAT64_PREFIX  | 2602:fc59:b0:64::  </br>或</br> [https://raw.github.../nat64Prefix.txt](https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/example/nat64Prefix.txt)    |❌| 指定自定NAT64前缀,不填走CF默认的 (https://amclubss.com/public/)     | [视频教程](https://www.youtube.com/watch?v=nx80sGpVoBM&t=533s)|
| SUB_CONFIG       | [https://raw.github.../ACL4SSR_Online_Mini.ini](https://raw.githubusercontent.com/amclubs/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_MultiMode.ini) |❌| clash、singbox等 订阅转换配置文件  ||
| SUB_CONVERTER    | url.v1.mk                    |❌| clash、singbox等 订阅转换后端的api地址                               ||
| NIP_HOST | 553558.xyz(默认) |❌| 优先IP时需要的nip服务 | |
| EXTRA_IP | [https://raw.github.../ipv4.txt](https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/example/ipv4.txt) |❌| 优先IP时需要的nip服务 | |
| EXTRA_IP_PROXY | [https://raw.github.../proxyip_am.txt](https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/example/proxyip_am.txt) |❌| 优先IP时需要的nip服务 | |
| CF_NAMESPACE_ID  | 37cf3x8xxx(Vercel方式部署才需求)     |❌ | 优先IP时需要CF的KV存桶ID（存储和数据库->Workers KV->创建的命名空间ID）        ||
| CF_ACCOUNT_ID    | 0b0e49ba2xxxx(Vercel方式部署才需求)  |❌ | 优先IP时需要CF的帐号ID（计算和AI->Account Details->Account ID）         ||
| CF_EMAIL         | xxx@gmail.com(Vercel方式部署才需求)  |❌ | 优先IP时需要CF的帐号邮箱        ||
| CF_API_KEY       | 49ba2xxxx(Vercel方式部署才需求)      |❌ | 优先IP时需要CF的API令牌（管理帐户->帐户API令牌->创建的令牌D）          ||

- 本频道订阅器转换地址：https://sub.amclubss.com
  
## 
### 🛠已适配订阅工具 [点击进入视频教程](https://youtu.be/xGOL57cmvaw) [点进进入karing视频教程](https://youtu.be/M3vLLBWfuFg)
<details>
<summary>点击展开/收起</summary>

- Mac（苹果电脑）
   - [v2rayU](https://github.com/yanue/V2rayU/releases) | [clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev/releases) | [Quantumult X](https://apps.apple.com/us/app/quantumult-x/id1443988620) |  [小火箭](https://apps.apple.com/us/app/shadowrocket/id932747118) | [surge](https://apps.apple.com/us/app/surge-5/id1442620678) | [karing](https://karing.app/download) | [sing-box](https://github.com/SagerNet/sing-box/releases)  | [Clash Nyanpasu](https://github.com/keiko233/clash-nyanpasu/releases) | [openclash](https://github.com/vernesong/OpenClash/releases) | [Hiddify](https://github.com/hiddify/hiddify-next/releases)

- Win（win系统电脑）
   - [v2rayN](https://github.com/2dust/v2rayN/releases) |  [clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev/releases) | [sing-box](https://github.com/SagerNet/sing-box/releases) |  [Clash Nyanpasu](https://github.com/keiko233/clash-nyanpasu/releases) | [openclash](https://github.com/vernesong/OpenClash/releases)  | [karing](https://karing.app/download) |  [Hiddify](https://github.com/hiddify/hiddify-next/releases)
     
- IOS（苹果手机）
   - [clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev/releases) |  [Quantumult X](https://apps.apple.com/us/app/quantumult-x/id1443988620)  |  [小火箭](https://apps.apple.com/us/app/shadowrocket/id932747118)  |  [surge](https://apps.apple.com/us/app/surge-5/id1442620678) |  [sing-box](https://github.com/SagerNet/sing-box/releases) | [Clash Nyanpasu](https://github.com/keiko233/clash-nyanpasu/releases) | [karing](https://karing.app/download) | [Hiddify](https://github.com/hiddify/hiddify-next/releases)
     
- Android（安卓手机）
   - [v2rayNG](https://github.com/2dust/v2rayNG/releases) |  [clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev/releases) | [sing-box](https://github.com/SagerNet/sing-box/releases) |  [Clash Nyanpasu](https://github.com/keiko233/clash-nyanpasu/releases) |  [karing](https://karing.app/download) | [Hiddify](https://github.com/hiddify/hiddify-next/releases)

- 软路由
   - [openclash(clash.meta)](https://github.com/vernesong/OpenClash/releases) 
  
</details>

##
###  🌟推荐
【糖果云】🌐官网：<a href="https://candytally.pro/web/#/login?code=vPvpo7tl">candytally.com</a>
</br>
✅送Emby|晚高峰8K|解锁流媒体GPT|专线🎁8折码：<code>candytally</code>
</br>
💰558元一年/每月600G 94元1200G/每月 54元600G/每月 

# 
<center>
<details><summary><strong> ☕ [点击展开] 赞赏支持 ~🧧</strong></summary>
*我非常感谢您的赞赏和支持，它们将极大地激励我继续创新，持续产生有价值的工作。*

- **USDT-TRC20:** `TWTxUyay6QJN3K4fs4kvJTT8Zfa2mWTwDD`
- **TRX-TRC20:** `TWTxUyay6QJN3K4fs4kvJTT8Zfa2mWTwDD`

<div align="center"> 
  <img src="https://github.com/user-attachments/assets/e6cdc42a-6374-4722-b833-601738f72196" width="200"></br> 
  TRC10/TRC20扫码支付 
</div> 
</details>
</center>

# 
 ⚠️免责声明:
 - 1、该项目设计和开发仅供学习、研究和安全测试目的。请于下载后 24 小时内删除, 不得用作任何商业用途, 文字、数据及图片均有所属版权, 如转载须注明来源。
 - 2、使用本程序必循遵守部署服务器所在地区的法律、所在国家和用户所在国家的法律法规。对任何人或团体使用该项目时产生的任何后果由使用者承担。
 - 3、作者不对使用该项目可能引起的任何直接或间接损害负责。作者保留随时更新免责声明的权利，且不另行通知。
 - 
