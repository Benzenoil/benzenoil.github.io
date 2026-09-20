---
title: Markdown语法备忘录
date: '2019-03-23T20:14:27+09:00'
slug: markdown-notes
draft: true
tags: []
frontmatter.tags: []
lastmod: '2019-03-25T00:59:24+09:00'
---

# 前言

写静态博客的一个问题，就在于偶尔会忘记Markdown的语法。特别是一些很特殊的用法。  
所以就想写一个博客记录一下感觉能经常用到语法

#正文

### 列表

```
- 列表1
- 列表2
- 列表3
```

可得

- 列表1
- 列表2
- 列表3

### 有序列表

```
1. 有序列表1
2. 有序列表2
3. 有序列表3
```

可得

1. 有序列表1
2. 有序列表2
3. 有序列表3

   ### 链接

   ```
   1. [show text](example.com)
   2. [show text 2](example.com)
   ```

   可得
4. [show text](example.com)
5. [show text 2](example.com)

   ### 插入图片

   ```
   ![](example.com/test.jpg)
   ![](example.com/test2.jpg)
   ```

可得  
 `![](example.com/test.jpg)`  
 `![](example.com/test2.jpg)`

### 引用

> 你好吗地球，我现在在你这里呢。  
>  换行测试了一下，也可以在一段里哦

### 斜体，粗体，写粗体

1. *斜体*
2. **粗体**
3. ***斜粗体***

### 代码相关

1. 如果只有单行，想这样，`Hello world`
2. 如果有多行的话，想这样

   ```
   print("multi lines")
   print("Hello world!")
   ```

### 表格

| column 1 | column2 | column 3 |
| --- | --- | --- |
| col1-content | col2-content | col3-content |

### 分割线

---



---



---



---
