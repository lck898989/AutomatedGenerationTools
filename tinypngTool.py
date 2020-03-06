# -*- coding: utf-8 -*-

"""脚本功能说明：使用 tinypng api，一键批量压缩指定文件(夹)所有文件"""

import os
import sys
import tinify
import shutil
import json

tinify.key = "pdKL87RV0Vp7vU2m25oyqs5W_gWVrrjj" # AppKey
# tinify.key = "Y2P5YK4VPxV75Gpq1VRQGKgtVQJFPFCH" # AppKey

def getTextFromPath(path):
    if os.path.exists(path):
        f = open(path, 'r',encoding="utf-8")
        data = f.read()
        f.close()

        return data

def get_file_dir(file):
    """获取文件目录通用函数"""
    fullpath = os.path.abspath(os.path.realpath(file))
    return os.path.dirname(fullpath)

def check_suffix(file_path):
    """检查指定文件的后缀是否符合要求"""
    file_path_lower = file_path.lower()
    return (file_path_lower.endswith('.png')
            or file_path_lower.endswith('.jpg')
            or file_path_lower.endswith('.jpeg'))

def compress_by_tinypng(input_file):
    """使用 tinypng 进行压缩，中文前面的 u 是为了兼容 py2.7"""
    if not check_suffix(input_file):
        print(u'只支持png\\jpg\\jepg格式文件：' + input_file)
        return

    print (os.getcwd());
    file_name = os.path.basename(input_file)
    print (file_name);
    output_path = os.path.join(os.getcwd(), 'tempTinyPng')

    print (get_file_dir(input_file));
    print (output_path);
    output_file = os.path.join(output_path, file_name)
    if not os.path.isdir(output_path):
        print("递归创建目录");
        os.makedirs(output_path)

    try:
        source = tinify.from_file(input_file)
        source.to_file(output_file)
        print(u'文件压缩成功：' + input_file)
        old_size = os.path.getsize(input_file)
        print(u'压缩前文件大小：%d 字节' % old_size)
        new_size = os.path.getsize(output_file)
        print(u'文件保存地址：%s' % output_file)
        print(u'压缩后文件大小：%d 字节' % new_size)
        print(u'压缩比： %d%%' % ((old_size - new_size) * 100 / old_size))
    except tinify.errors.AccountError:
        print(u'Key 使用量已超，请更新 Key，并使用命令[Usage] %s [filepath] [key]运行'
              % os.path.basename(sys.argv[0]))

def check_path(input_path):
    """如果输入的是文件则直接压缩，如果是文件夹则先遍历"""
    if os.path.isfile(input_path):
        compress_by_tinypng(input_path)
    elif os.path.isdir(input_path):
        dirlist = os.walk(input_path)
        for root, dirs, files in dirlist:
            for filename in files:
                compress_by_tinypng(os.path.join(root, filename))
    else:
        print(u'目标文件(夹)不存在，请确认后重试。')

def startCutDown(input_path):

    # 读取配置 修改key
    configPath = os.getcwd() + "/AutoConfig.json"
    # 读取config
    configDataStr = getTextFromPath(configPath)
    if configDataStr != None:
        AutoConfigData = json.loads(configDataStr)
        if AutoConfigData != None:
            if "TinifyKey" in AutoConfigData:
                tinify.key = AutoConfigData["TinifyKey"]
                print(" 根据configPath 修改TinifyKey")

    output_path = os.path.join(os.getcwd(), 'tempTinyPng')

    if os.path.exists(output_path):
        #删除文件
        shutil.rmtree( output_path )

    # 创建文件夹
    os.mkdir(output_path)

    # 压缩  complete && preload 文件夹跳过
    for parent,dirnames,filenames in os.walk(input_path):
        if parent == input_path:
            # 文件
            for i in dirnames:
                if i == "complete" or i == "preload":
                    pass
                else:
                    check_path(parent + "/" + i)

    # 拷贝压缩过的文件
    print(u'开始拷贝压缩文件')
    output_path = os.path.join(os.getcwd(), 'tempTinyPng')
    for parent,dirnames,filenames in os.walk(input_path):
        for i in filenames:
            if parent == input_path + "/complete" or parent == input_path + "/preload":
                pass
            else:
                if i.endswith('.png') or i.endswith('.jpg') or i.endswith('.jpeg'):
                    targetImgPath = output_path + "/" + i
                    oldImgPath = parent + "/" + i
                    if os.path.exists(targetImgPath):
                        shutil.copy(targetImgPath,oldImgPath)
                        # print(u'success copy ' + oldImgPath)
                    else:
                        print(u'error tinyPng copy To ' + oldImgPath)


if __name__ == '__main__':
    # len_param = len(sys.argv)
    # if len_param != 2 and len_param != 3:
    #     print('[Usage] %s [filepath]' % os.path.basename(sys.argv[0]))
    # elif len_param == 3:
    #     tinify.key = sys.argv[2]
    #     check_path(sys.argv[1])
    # else:
    #     check_path(sys.argv[1])
    startCutDown(os.getcwd() + "/Target_Framework/resource/courseware/assets");