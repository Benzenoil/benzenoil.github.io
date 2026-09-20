---
title: ARTS-第2周总结
date: '2019-04-02T21:36:20+09:00'
slug: arts-week2
draft: true
tags:
- ARTS
frontmatter.tags:
- ARTS
lastmod: '2019-04-15T15:24:34+09:00'
---

上周由于带状麻疹，没能控制好进度。现在补上。

## Algotithm

问题：`2. Add Two Numbers`  
概述：以Linklist的形式给出2个数字，将其相加以后的值已Linklist的形式Return回来。

第一个想到的解法是，额外做2个 `数字 <-> LinkList`的 Function。然后把输入的LinkList  
转换成数字，数字相加后，再转换成LinkList，Return

具体实现如下  

```
class Solution(object):
    def linklistToNum(self, l):
        times = 1
        result = 0

        while l:
            result += int(l.val) * times
            times *= 10
            l = l.next
        return result

    def NumTolinklist(self, num):
        target = []

        for c in str(num):
            target.append(c)

        head = ListNode(None)
        point = head
        while target != []:
            tmp = target.pop()
            point.next = ListNode(tmp)
            point = point.next

        return head.next

    def addTwoNumbers(self, l1, l2):
        """
        :type l1: ListNode
        :type l2: ListNode
        :rtype: ListNode
        """
        num1 = self.linklistToNum(l1)
        num2 = self.linklistToNum(l2)
        answer = num1 + num2

        return self.NumTolinklist(answer)
```

得到的结果是运行速度还可以，but内存使用率很高。

## Review

本周在读一篇论文  
[Medical code prediction with multi-view convolution and  
 description-regularized label-dependent attention](https://arxiv.org/pdf/1811.01468.pdf)

主要讲述了一种新的End to End 神经网络，来预测ICD Code的模型

## Tips

自己学习了一下如何在Ubuntu上部署Django项目  
详细查看[博客文章](/p/django-deploy/)

## Share

自然语言处理中的一个名为BERT的模型，值得关注一下。  
具体论文如下 <https://arxiv.org/abs/1810.04805>
