### 2017-01-06（2.2.5）

增加 ：

1、RongIMClient.initApp 方法，此方法会自动连接融云。

2、获取聊天室历史消息方法

修复：

1、历史消息接口 count 为 1 ，第二次获取消息缺失的问题。

2、导航信息存储方式改为覆盖不删除，2.2.4 版本是删除再写入。

优化：

SDK 代码细化分层。