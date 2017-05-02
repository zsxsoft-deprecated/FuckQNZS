FuckQNZS
==================

艹爆青年之声！


## 背景
### 什么是青年之声？

这是一套：
- 致力于浪费大学生时间的系统
- 劳民伤财，完全不走心的系统
- [开发者自以为有用的系统](https://www.zhihu.com/question/45563084/answer/128865730)
- [开发者厚颜无耻拿着刷出来的数据吹捧的系统](https://www.zhihu.com/question/45563084/answer/128865730)

### 这个项目的用途是什么？
手机版协议登录青年之声，自动从知乎拉取问题，批量提问到青年之声，用随机内容回答问题。

## 安装

需要首先安装Nodejs > v7.6以上的版本。
```bash
git clone https://github.com/zsxsoft/FuckQNZS
cd FuckQNZS
npm install
```

## 配置
1. 创建``config/password.csv``，以以下格式往里面写入数据：
```txt
Username,password
SecondUsername,SecondPassword
And,soon
```
2. 修改``config/index.js``，写入你的班级ID和知乎待采集的班级ID
3. 没有了。

## 使用

1. 先把``data``文件夹完全清空，但不能删除该文件夹。即``rm -rf data/*``
2. ``node server``，启动数据库
3. 另开终端，``node loginAll``，登录并获得所有的AccessToken。
4. ``node getZhihu``，从知乎采集问题并存入数据库
5. ``node askAll``，开始问问题
6. ``node answerAll``，回答刚才回答的问题（可以多次执行）

## 设计问题答疑
### 为什么要修改班级ID？
不修改的话，你的提问将不会被计入这个团支部。青年之声系统设计如此，不是很能理解他们怎么能写成这个样子。

### 为什么要把问问题和获取问题分开？

他们现在终于知道，在一次提问的JSON里，应该返回刚才提问的地址，而不是让用户自己去刷自己的提问页面了；可喜可贺可喜可贺！！！！！！

  <del>因为这套系统的设计极其愚蠢。它的接口问完问题不返回刚才问了什么，所以只能问完之后确定一下都问了一些什么。也正因为如此，最好一个账号对应一个话题。知乎一个话题通常有20个问题，这也恰好是青年之声一页问题的数目。话题设置过多的话，多提的问题可能不会被记录。</del>

### 为什么socket.io-client是0.9.6版本？
因为青年之声的登录接口就是用的这个特别老的版本。


## 协议
The MIT License