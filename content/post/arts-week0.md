---
title: ARTS-第0周总结
date: '2019-03-24T21:51:21+09:00'
slug: arts-week0
draft: true
tags:
- ARTS
frontmatter.tags:
- ARTS
lastmod: '2019-04-12T10:53:39+09:00'
---

## 什么是ATRS项目

ATRS 项目包括了4块内容

- Algorithm ： 每周至少一篇leetcode算法题，主要是练习算法，巩固知识
- Review ： 阅读并点评至少一篇英语技术文章，主要是为了提高英语能力
- Tip ： 学习至少一个技术技巧
- Share ： 分享一篇有观点和思考的技术文章

---

以下是 WEEK-0 的内容

## Algotithm

本周完成了2道算法题

- 7 Reverse Integer
- 13 Roman to Integer

简单介绍其中的一道题： 7. Reverse Integer  
给定一个数`x`，将其反转，若反转后的数`x’`属于32bit-int的区间内就将其print，否则输出0。

我的解法如下↓  

```
def reverse(self, x):
    """
    :type x: int
    :rtype: int
    """        
    notNegative = True
    target = []

    for c in str(x):
        if c == '-':
            notNegative = False
            continue
        target.append(c)
    target.reverse()
    answer = ''.join(target)
    if notNegative:
        answer = int(answer)
    else:
        answer = int(answer) * -1
    
    limitation = [-1 * pow(2,31), pow(2,31)-1]
    if answer <= limitation[0] or answer >= limitation[1]:
        return 0
    else:
        return answer
```

简单介绍：  
第一个想到的解法就是用python自带的`list.reverse()`来翻转list，最后将数组转换成int型来得到答案，并判断其是否为有效答案并输出。

## Review

Jay Alammar 在[blog文章](https://jalammar.github.io/illustrated-transformer/)里仔细，可视化的介绍了Transformer这个模型.  
如果要点评的话，就是Jay Alammar在文章中从宏观，到微观的，一步一步的介绍了每个模块的运行过程，还有计算过程，简单易懂。  
另一方面，对比较难理解的核心部分self-attention也有一个可视化的解释。  
简单说明一下Transformer的技术结构的话，大概可以写成这样。

- Transformer
  - Encoder \* N个
    - Self-attention
    - Add & Normalize
    - FF(Feed Forward)
  - Decoder \* N个

## Tips

以前总是在Evernote，blogger， sina博客上写东西，没怎么太注意过format的东西，但是在githubpage上写文章的话都需要用到Markdown语言，  
所以就自己总结了一下一些常用的语法，方便自己查看  
[Markdown常用语法](/p/markdown-notes/)

## Share

因为是自然语言的研究生，所以对这方面的知识比较关注，在年末的时候[张俊林](https://www.zhihu.com/people/zhang-jun-lin-76)在知乎上发布  
了一篇文章，讲述的就是一个在nlp领域近期非常受关注的Transformer模型，比起原生的RNN和CNN相比，在NLP的各个任务中都取得了不错的成绩。  
[详细看这里](https://zhuanlan.zhihu.com/p/54743941)
