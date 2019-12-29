## 介绍
> 在实际项目中，经常能遇到用户想用excel导入数据的场景。而通过excel编辑的数据很难控制数据的准确性和规范性。
> 而Grid-import要求用户先将excel数据导入系统，系统会自动转换出对应的web表格数据，让用户编辑和查看对应的出错提示，提交导入系统。
> 从而将不可控数据转变成可控的过程。

## 特点
+ 采用ant组件开发
+ 理论上支持无限嵌套子母表
+ 自动完成excel到grid格式的转换，开发者仅需关心业务逻辑接口
+ [qs-excel](https://github.com/tiderjian/qs-excel)完成excel的操作, gridImport仅关心web表格生成和完成两个组件间不同的数据格式转换

## 安装
```php
composer require tiderjian/qs-gridImport
```

## 用法

+ 定义表格配置

[列类型](#列类型)
```php
title 列标题
key 列关键字
type 列类型
```

#### 列类型
