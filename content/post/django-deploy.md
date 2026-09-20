---
title: 在Ubuntu上通过Nginx, uWSGI部署Django项目
date: '2019-04-02T23:39:50+09:00'
slug: django-deploy
draft: true
tags:
- Django
frontmatter.tags:
- Django
lastmod: '2019-04-07T00:37:40+09:00'
---

## 前言

最近在学习Django，发现要创建一个Django项目挺容易的，但是要把他部署到Server上却困难重重。  
Google了一圈也没有发现什么很详细的上手指南，折腾了1天多，最后终于弄出来了。感动万分。  
写出来总结一下，也为了帮助后面有需要的人。

将一个Django项目部署到云端，大致需要几个步骤。

1. 首先你需要有一个可以在local运行的项目，没有其实问题也不大，可以用原始的页面。
2. 一台可以线上部署的服务器（AWS,Vultr, 阿里云, 腾讯云等等）
   - 类似Putty or Xshell这种控制端（Mac好像可以直接ssh？Windows下也有cmder这种可以用）
3. 百折不挠的精神–非常重要！

其中，对服务器的设置又可以分成

- 准备部署环境
- 测试各部门是否正常运行
- 上传local的项目并调整参数
- 重启http服务器，部署成功

本文主要解决了**在Ubuntu中准备部署Django环境**的问题。

## 操作环境

我是在以下环境下进行操作的，注意不同的环境下情况可能会略有不同。

- Local
  - OS: Windows 10 Pro (64bit)
  - Terminal: Cmder
  - Hosting service:Aliyun (教程使用阿里云，当然我一开始是用Vultr测试部署的)
- Server
  - 纯净Ubuntu 18.04
  - root用户下

## 具体步骤

完成Django的线上部署，简单来说我们一共有4个步骤需要完成

1. Python3 & Pip的安装
2. 创建Django项目（或者导入）
3. 安装与配置uWSGI
4. 安装与配置Nginx

再我们正式进入之前，有一点要说明的是，以下代码均没有加上`sudo`，如果有哪里因为权限问题失败了，可以加上sudo再试一下。

### Python3 与 Pip 的安装

首先更新一下系统  

```
$ apt-get update
$ apt-get upgrade
```

安装依赖库  

```
$ apt-get install build-essential libtool
$ apt-get install libpcre3 libpcre3-dev zlib1g-dev openssl
```

安装python3和pip3  

```
$ apt-get install python3.7
$ apt-get install python3-pip
```

创建存放虚拟环境和项目的文件夹  

```
$ mkdir -p /www/project/env
$ mkdir -p /www/project/firstpage
```

创建虚拟环境  

```
# virtualenv -p [python路径] [项目路径]
$ virtualenv -p /usr/bin/python3 /www/project/env/firstpage
```

如果不知道python路径，可以`which python3`看一下

启动虚拟环境  

```
$ source /www/project/env/firstpage/bin/activate
```

命令行的最前面出现`(firstpage)`即代表处于虚拟环境下

### 安装Django 并创建项目

安装Django， 创建新项目`firstpage`并进入  

```
$ pip install django
$ cd /www/project/
$ django-admin startproject firstpage
$ cd firstpage
```

migrate 然后运行一下，看看程序是否正常  

```
$ python manage.py migrate
$ python manage.py runserver
```

显示出如下说明程序没问题（理所当然的）  

```
Django version 2.2, using settings 'firstpage.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

### Uwsgi 安装和配置

#### 安装并测试 Uwsgi

同样的，我们在虚拟环境下，安装uWSGI  

```
# pip install uwsgi
```

然后在项目根目录下，创建一个`test.py`文件，内容如下  

```
# test.py
def application(env, start_response):
    start_response('200 OK', [('Content-Type','text/html')])
    return [b"Hello World"]
```

然后我们运行uWSGI，特别注意的是，阿里云用户需要提前打开入方向的8000端口权限。  
如果默认80端口开，可以将下面的8000端口，改成80端口测试  

```
$ uwsgi --http :8000 --wsgi-file test.py
```

在地址栏中输入 `你的域名:端口号`，网页上显示Hello World则表示uWSGI成功运行  
同时代表了以下通讯是正常进行的  

```
thw web client < -- > uWSGI < -- > Python App
```

接下去我们将我们的Django项目指定给uWSGI，看看是否能够成功运行  

```
$ uwsgi --http :8000 --wsgi-file /www/project/firstpage/firstpage/wsgi.py
```

Oh, 发现抛出了一个错误  

```
DisallowedHost at /
Invalid HTTP_HOST header: ..... You may need to add "你的域名" to ALLOWED_HOSTS
```

原来我忘记提前设置被允许的域名了，让我现在来添加他。进入到项目文件夹中，找到`settings.py`  

```
$ cd firstpage
$ vi settings.py
```

找到`ALLOWED_HOSTS`,将其list中加入你的域名，像这样↓  

```
ALLOWED_HOSTS = ['XXX.XXX.XXX.XXX']
```

然后保存文件。  
关于vim的上手方法，可以参考这个链接，[简明VIM练级攻略](https://coolshell.cn/articles/5426.html)

然后回到项目根目录，我们重新运行一下  

```
$ uwsgi --http :8000 --wsgi-file /www/project/firstpage/firstpage/wsgi.py
```

成功显示出我们的小火箭，说明uWSGI安装并配置成功  
![成功的小火箭](/images/legacy/af26ae9f1b-successfully-mark.jpg)

#### 创建uWSGI配置文件

首先我们找到一个可以保存uWSGI配置的地方,添加配置文件

```
$ mkdir -p /etc/uwsgi/sites
$ vi /etc/uwsgi/sites/firstpage.ini
```

配置内容如下，深入了解可参见[uWSGI文档](https://uwsgi-docs.readthedocs.io/en/latest/index.html)  
或者其他攻略  

```
[uwsgi]
chdir = /www/project/firstpage  # 项目目录
home = /www/project/env/firstpage  # 虚拟环境目录
wsgi-file = %(chdir)/firstpage/wsgi.py  # wsgi文件位置

master = true
processes = 4

socket = /run/uwsgi/firstpage.sock  # sock存储位置
chmod-socket = 666
vacuum = true
```

保存文件，这样`firstpage`的配置文件就设置好了。

#### 启用Emperor服务

Emperor 模式下，他会监控uWSGI的配置文件目录，每当配置文件发生改变，  
他会自动做出调整。

关于详细的参数的意义，可以参考[这个教程](https://www.digitalocean.com/community/tutorials/how-to-serve-django-applications-with-uwsgi-and-nginx-on-ubuntu-16-04#create-a-systemd-unit-file-for-uwsgi)的相关段落（Create a systemd Unit File for uWSGI）

```
$ vi /etc/systemd/system/uwsgi.service
```

配置文件如下,录入后保存  

```
[Unit]
Description=uWSGI Emperor service

[Service]
ExecStartPre=/bin/bash -c 'mkdir -p /run/uwsgi; chown root:www-data /run/uwsgi'
ExecStart=/usr/local/bin/uwsgi --emperor /etc/uwsgi/sites
Restart=always
KillSignal=SIGQUIT
Type=notify
NotifyAccess=all

[Install]
WantedBy=multi-user.target
```

这样我们uWSGI的配置部分就完成了

### Nginx 安装与配置

接下去我们来处理一下Nginx  
首先我们先安装nginx，并运行一下看看  

```
$ apt-get install nginx
$ /etc/init.d/nginx start    # start nginx
```

你将会得到一个`Welcome to Nginx`的消息，说明nginx安装成功，并且通讯正常。  

```
the web client < -- > the web server
```

接下去我们来添加配置文件  

```
$ vi /etc/nginx/sites-available/firstpage
```

```
# firstpage

server {
        listen 8000;
        server_name xxx.xxx.xxx.xxx; # 你的域名

        location = /favicon.ico { access_log off; log_not_found off; }
        location /static/ {
                alias /www/project/firstpage/static;
        }

        location / {
                include /etc/nginx/uwsgi_params;
                uwsgi_pass      unix:/run/uwsgi/firstpage.sock;
        }
}
```

保存后link到`sites-enabled`目录以启用他们  

```
$ ln -s /etc/nginx/sites-available/firstpage /etc/nginx/sites-enabled
# 若需要覆盖文件，可使用
$ ln -s -f ...
```

检测配置文件语法  

```
$ nginx -t
```

若无问题，应该会返回`test is successful`,随后我们重新加载nginx服务以加载新的配置  
同时启动uWSGI服务器  

```
$ systemctl restart nginx
$ systemctl start uwsgi
```

我们发现他提醒我们没有找到 `uwsgi.service`才想起来uWSGI  
还只存在于我们虚拟环境下，现在我们来全局配置他。

### 全局调整

首先我们退出虚拟环境  

```
$ deactivate
```

在全局环境下安装django 和 uWSGI  

```
$ pip3 install django
$ pip3 install uwsgi
```

随后我们重新启动uWSGI服务器。发现8000端口拒绝了我们的访问，这有点始料未及。  
不过当我把nginx的配置文件`/etc/nginx/sites-available/firstpage`中端口更改到80端口，链接并重启nginx后Django项目成功运行了。  
所以估计还是阿里云服务器的安全组配置出现了一点问题。就留这个问题到下次去解决吧。

最后如果需要开机启动的话可以运行以下命令  

```
$ systemctl enable nginx
$ systemctl enable uwsgi
```

## 小结

- 在部署Django项目的过程中，遇到了无数的问题，发现一些教程，哪怕你从头跟他做到尾，总会有一两个步骤  
  出现了不一样的结果，然后自己没能力解决的话，就只能把服务器reset，再去找别的教程，这个过程花费了很多精力。  
  特别是原本想要部署到Centos7上的。最后还是改成了Ubuntu。
- 另外一方面，认真理解每一个步骤在干什么，配置参数的一些意义的重要性。  
  特别是面对英文的Document，语言的劣势，加上急迫想要部署的心情，很容易忽略一些很重要的地方。Game Over
- 要想自己有所“建设”，还是需要去理解一个一个的意义，逃不掉。

## 参考资料

1. [uWSGI Documents](https://uwsgi-docs.readthedocs.io/en/latest/WSGIquickstart.html)
2. [How To Serve Django Applications with uWSGI and Nginx on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-serve-django-applications-with-uwsgi-and-nginx-on-ubuntu-16-04)
3. [使用uWSGI和nginx来设置Django和你的web服务器](https://uwsgi-docs-zh.readthedocs.io/zh_CN/latest/tutorials/Django_and_nginx.html)
4. [Ubuntu部署Django项目方法详解](https://www.django.cn/article/show-22.html)
