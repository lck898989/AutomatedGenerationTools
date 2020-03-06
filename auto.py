#!/usr/bin/python
#coding=utf-8
import os
import shutil
import re
import sys
import tinify
from os import path 
import json

import buildCodeTools
import tinypngTool

import imp
from imp import reload
reload(sys)
# sys.setdefaultencoding('utf-8')

# 遍历美术资源的时候 赋值
curPageMax = 1   
initConfigData = None 


# 初始化 路径
import platform
TextureMergerPath = "/Applications/TextureMerger.app/Contents/MacOS/TextureMerger"
if platform.system() == "Windows":
    TextureMergerPath = "D:/Tools/Egret/TextureMerger/TextureMerger.exe"


def is_admin():
    try:
        print("有权限");
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        print("没有权限");
        return False

def execCmd(cmd):
    return os.popen(cmd).read() 

def get_file_dir(file):
    """获取文件目录通用函数"""
    fullpath = os.path.abspath(os.path.realpath(file))
    return os.path.dirname(fullpath)

def getTextFromPath(path):
    if os.path.exists(path):
        f = open(path, 'r',encoding="utf-8")
        data = f.read()
        f.close()

        return data

def getInitConfigData(configPath):

    global initConfigData

    configDataStr = getTextFromPath(configPath)
    if configDataStr.startswith(u'\ufeff'):
            configDataStr = configDataStr.encode('utf8')[3:].decode('utf8')

    configData = None
    if configDataStr != None:
        configData = json.loads(configDataStr)

    initConfigData = configData

def copyToTarget(oldPath, newPath):

    if os.path.exists(newPath):
        #删除文件
        shutil.rmtree( newPath )

    # 创建文件夹
    os.mkdir(newPath)

    # 拷贝文件  除git 
    for parent,dirnames,filenames in os.walk(oldPath):
        if parent == oldPath:
            # 文件
            for i in filenames:
                if i == ".git" or i == ".gitignore":
                    pass
                else:
                    newPathTemp = newPath + "/" + i
                    oldPathTemp = oldPath + "/" + i
                    shutil.copy(oldPathTemp,newPathTemp)
            # 文件夹
            for i in dirnames:
                newPathTemp = newPath + "/" + i
                oldPathTemp = oldPath + "/" + i
                shutil.copytree(oldPathTemp,newPathTemp)


def makeDirForPath(path):
    dirPath = get_file_dir(path)
    if not os.path.exists(dirPath):
        os.mkdir(dirPath)

def copyResToTarget(oldResPath, newResPath, patrentPath):
    # 拷贝res资源
    if not os.path.exists(oldResPath):
        print ("copyResToTarget error oldResPath not exists")

    if not os.path.exists(newResPath):
        print ("copyResToTarget error newResPath not exists")
        os.makedirs(newResPath)

    # 读取配置
    configPath = patrentPath + "/AutoConfig.json"
    # 读取config
    configDataStr = getTextFromPath(configPath)

    if configDataStr != None:
        AutoConfigData = json.loads(configDataStr)
        if AutoConfigData != None:
            if "TextureMergerPath" in AutoConfigData:
                global TextureMergerPath
                TextureMergerPath = AutoConfigData["TextureMergerPath"]
                print(" 根据configPath 修改TextureMergerPath")

    global initConfigData
    className = ""
    if "className" in initConfigData:
        className = initConfigData["className"]
        print(" 根据configPath 获取前缀 className = ", className)

    #删除临时文件夹
    tempResPath = patrentPath + "/tempRes"
    if os.path.exists(tempResPath):
        shutil.rmtree( tempResPath )

    tempMax = 0
    for parent,dirnames,filenames in os.walk(oldResPath):

        # 拷贝背景
        for i in filenames:
            m=re.search(".*jpg$",i)
            if m != None and parent == oldResPath:
                # 根目录 jpg
                tempMax = tempMax + 1

                index = i.replace(".jpg", "")

                makeDirForPath(newResPath + "/" + className + "_page_scene" + index + "/" + className + "_page_scene_bg" + i)

                shutil.copy(parent + "/" + i,newResPath + "/" + className + "_page_scene" + index + "/" + className + "_page_scene_bg" + i)

        #和图
        for i in dirnames:

            if i == "preload" and parent == oldResPath:
                # preload
                preloadPath = parent + "/" + i
                # 拷贝 文件 && 合图
                for parentPreload,dirnamesPreload,filenamesPreload in os.walk(preloadPath):
                    if parentPreload == preloadPath:
                        # 文件
                        for fileNamePreload in filenamesPreload:
                            # 拷贝文件 到目标目录
                            makeDirForPath(newResPath + "/" + className + "_preload/" + className + "_Preload_" + fileNamePreload)
                            shutil.copy(parentPreload + "/" + fileNamePreload,newResPath + "/" + className + "_preload/" + className + "_Preload_" + fileNamePreload)
                        # 文件夹
                        for dirNamePreload in dirnamesPreload:
                            # 合图 然后到目标目录
                            tempDirPath = parentPreload + "/" + dirNamePreload
                            for parentTemp,dirnamesTemp,filenamesTemp in os.walk(tempDirPath):
                                for iTemp in filenamesTemp:
                                    # 重命名文件
                                    if (iTemp.find(className + "_PreSmall_")) > -1:
                                        # 已经重命名过的 pass
                                        pass
                                    else:
                                        # print("=====" + parentTemp + "/" + iTemp)
                                        shutil.move(parentTemp + "/" + iTemp,parentTemp + "/" + className + "_PreSmall_" + iTemp)

                            # 文件夹
                            pngPathTemp = parentPreload + "/" + dirNamePreload
                            bigPathTemp = patrentPath + "/tempRes/" + className + "_PreBig_" + dirNamePreload + ".json"
                            bigPathPngTemp = patrentPath + "/tempRes/" + className + "_PreBig_" + dirNamePreload + ".png"
                            execCmd("%s -p %s -o %s" %(TextureMergerPath, pngPathTemp, bigPathTemp)) 
                            # execCmd("D:/egret/Lakeshore/Egret/Egret/Egret/TextureMerger/TextureMerger.exe -p %s -o %s" %(pngPathTemp, bigPathTemp)) 文件压缩路径配置 window版本


                            #拷贝合图
                            if os.path.exists(bigPathTemp):
                                shutil.copy(bigPathTemp,newResPath + "/" + className + "_preload/" + className + "_PreBig_" + dirNamePreload + ".json")
                                shutil.copy(bigPathPngTemp,newResPath + "/" + className + "_preload/" + className + "_PreBig_" + dirNamePreload + ".png")
                            else:
                                print ("TextureMerger 没有生成图片 " + bigPathPngTemp)

            elif parent == oldResPath:
                # 页面相关
                tempDirPath = parent + "/" + i
                for parentTemp,dirnamesTemp,filenamesTemp in os.walk(tempDirPath):
                    for iTemp in filenamesTemp:
                        # 重命名文件
                        if (iTemp.find(className)) > -1:
                            # 已经重命名过的 pass
                            pass
                        else:
                            # print("=====" + parentTemp + "/" + iTemp)
                            shutil.move(parentTemp + "/" + iTemp,parentTemp + "/" + className + "_" + iTemp)

                # 文件夹
                pngPathTemp = parent + "/" + i
                bigPathTemp = patrentPath + "/tempRes/" + className + "_big_page_scene" + i + ".json"
                bigPathPngTemp = patrentPath + "/tempRes/" + className + "_big_page_scene" + i + ".png"
                execCmd("%s -p %s -o %s" %(TextureMergerPath, pngPathTemp, bigPathTemp)) 
                # execCmd("D:/egret/Lakeshore/Egret/Egret/Egret/TextureMerger/TextureMerger.exe -p %s -o %s" %(pngPathTemp, bigPathTemp)) 文件压缩路径配置 window版本


                #拷贝合图
                if os.path.exists(bigPathTemp):
                    shutil.copy(bigPathTemp,newResPath + "/" + className + "_page_scene" + i + "/" + className + "_big_page_scene" + i + ".json")
                    shutil.copy(bigPathPngTemp,newResPath + "/" + className + "_page_scene" + i + "/" + className + "_big_page_scene" + i + ".png")
                else:
                    print ("TextureMerger 没有生成图片 " + bigPathPngTemp)

    #拷贝合图
    # if os.path.exists(tempResPath):
    #     for parent,dirnames,filenames in os.walk(tempResPath):
    #         for i in filenames:
    #             shutil.copy(parent + "/" + i,newResPath + "/big/" + i)



    #当前有多少页课件
    global curPageMax
    curPageMax = tempMax


def buildCode(newCodePath, oldResPath, codeMouldPath, patrentPath):

    global curPageMax
    global initConfigData

    resPath = newCodePath + "/resource/courseware/game_skins"
    codePath = newCodePath + "/src/courseware/scene"
    if "classNameReal" in initConfigData:
        classNameReal = initConfigData["classNameReal"]
        resPath = newCodePath + "/resource/" + classNameReal + "/game_skins"
        codePath = newCodePath + "/src/" + classNameReal + "/scene"

    if not os.path.exists(resPath):
        os.mkdir(resPath)
    if not os.path.exists(codePath):
        os.makedirs(codePath)


    # 读取配置
    configPathTemp = patrentPath + "/AutoConfig.json"
    # 读取config
    configDataStrTemp = getTextFromPath(configPathTemp)
    className = ""
    if "className" in initConfigData:
        className = initConfigData["className"]
        print(" 根据configPath 获取前缀 className = ", className)


    for num in range(0,curPageMax):

        index = num + 1


        configPath = oldResPath + "/" + str(index) + "/autoConfig.txt"
        # 读取config
        configDataStr = getTextFromPath(configPath)
        configData = None

        if configDataStr != None:
            configData = json.loads(configDataStr)

        if configData == None:
            if "imgDataList" in initConfigData:
                imgDataList = initConfigData["imgDataList"]

                for i, imgData in enumerate(imgDataList):
                    if "index" in imgData and "type" in imgData:
                        tempIndex = imgData["index"]
                        if tempIndex == index:
                            configData = imgData
        
        # 生成代码
        buildCodeTools.buildCodeScene(codePath, index, configData, codeMouldPath, className)

        # 生成资源 皮肤
        buildCodeTools.buildResExml(resPath, index, configData, codeMouldPath, className)

def changeCode(newCodePath):
    global curPageMax
    global initConfigData

    classNameReal = ""
    if "classNameReal" in initConfigData:
        classNameReal = initConfigData["classNameReal"]
        print(" 根据configPath 获取前缀 classNameReal = ", classNameReal)
    className = ""
    if "className" in initConfigData:
        className = initConfigData["className"]
        print(" 根据configPath 获取前缀 className = ", className)

    # loadingScenePath = newCodePath + "/src/scene/LoadingScene/LoadingScene.ts"
    # if os.path.exists(loadingScenePath):

        # oldIndexMax = 'CommunicationManager.getInstance().makePostMessage("onPagenum", "totalPages", 6);'
        # newIndexMax = 'CommunicationManager.getInstance().makePostMessage("onPagenum", "totalPages", ' + str(curPageMax+1) + ');'

    #     zz = open(loadingScenePath, "r+",encoding="utf-8")

    #     lines = zz.readlines()
    #     if len(lines) > 0 :
    #         zz.seek(0)
    #         zz.truncate()

    #         for lineIndex, strA in enumerate(lines):

    #             strNew = strA

    #             strNew = strNew.replace(oldIndexMax, newIndexMax)

    #             zz.write(strNew)

    #     zz.close()

    mainPath = newCodePath + "/src/Main.ts"
    if os.path.exists(mainPath):

        oldIndexMax = 'GameLayerManager.gameLayer().loadLayer.removeChildren();'
        newIndexMax = 'CommunicationManager.getInstance().goTargetPageHandle(1);\n        GameLayerManager.gameLayer().loadLayer.removeChildren();'

        oldIndexMaxTotalPages = 'CommunicationManager.getInstance().makePostMessage("onPagenum", "totalPages", 6);'
        newIndexMaxTotalPages = 'CommunicationManager.getInstance().makePostMessage("onPagenum", "totalPages", ' + str(curPageMax+2) + ');'

        oldJsonPath = 'await RES.loadConfig("resource/courseware/courseware.res.json", "/resource")'
        newJsonPath = 'await RES.loadConfig("resource/' + classNameReal + '/' + classNameReal + '.res.json", "/resource")'

        oldThmDesc = 'new eui.Theme("resource/courseware/courseware.thm.json", this.stage)'
        newThmDesc = 'new eui.Theme("resource/' + classNameReal + '/' + classNameReal + '.thm.json", this.stage)'

        oldCoursewareName = 'this.coursewareName = "courseware";'
        newCoursewareName = 'this.coursewareName = "' + classNameReal + '";'

        zz = open(mainPath, "r+",encoding="utf-8")

        lines = zz.readlines()
        if len(lines) > 0 :
            zz.seek(0)
            zz.truncate()

            for lineIndex, strA in enumerate(lines):

                strNew = strA

                # strNew = strNew.replace(oldIndexMax, newIndexMax)

                # strNew = strNew.replace(oldIndexMaxTotalPages, newIndexMaxTotalPages)

                # strNew = strNew.replace(oldJsonPath, newJsonPath)

                # strNew = strNew.replace(oldThmDesc, newThmDesc)

                strNew = strNew.replace(oldCoursewareName, newCoursewareName)

                zz.write(strNew)

        zz.close()



    VersionManagerPath = newCodePath + '/src/' + classNameReal + '/config/' + classNameReal + 'Version.ts'
    if initConfigData != None and "courseware_name" in initConfigData:
        if os.path.exists(VersionManagerPath):
            strName = initConfigData["courseware_name"]
            newName = '    public static courseware_name:string = "' + strName + '";\n'
            oldName = "courseware_name"

            zz = open(VersionManagerPath, "r+",encoding="utf-8")

            lines = zz.readlines()
            if len(lines) > 0 :
                zz.seek(0)
                zz.truncate()

                for lineIndex, strA in enumerate(lines):

                    strNew = strA

                    if (strNew.find(oldName)) > -1:
                        strNew = newName
                    else:
                        pass

                    zz.write(strNew)

            zz.close()

        else:
            print ("VersionManagerPath error not find path = " + VersionManagerPath)

def buildSceneList(newCodePath, className):
    jsonMap = {}
    classNameMap = []
    jsonMap["courseware"] = classNameMap

    global curPageMax

    maxIndexTemp = curPageMax
    classNameMap.append({"name": "DolphinIsland","curLoad": "dolphinIsland"})

    for num in range(0,maxIndexTemp):
        tempIndex = num + 1
        tempData = {}
        tempData["name"] = className + "_Page" + str(tempIndex) + "Scene"
        tempData["curLoad"] = className + "_page_scene" + str(tempIndex)
        classNameMap.append(tempData)

    classNameMap.append({"name": "GetStarScene","curLoad": "complete", "data": { "starName" : "star_png", "backIndex" : 1}})

    strNew = json.dumps(jsonMap)

    writePath = newCodePath + '/resource/' + classNameReal + '/assets/' + classNameReal + '_preload/' + className + '.json'
    zz = open(writePath, "r+",encoding="utf-8")
    zz.seek(0)
    zz.truncate()
    zz.write(strNew)
    zz.close()

if __name__=="__main__":

    d = path.dirname('.');
    patrentPath = path.abspath(d)

    # 更新git 课件基本框架

    # 拷贝文件
    oldPath = patrentPath + "/Courseware_Framework"
    newPath = patrentPath + "/Target_Framework"

    print(" 更新主工程的代码")
    os.system('git submodule foreach git reset --hard HEAD')
    os.system('git submodule foreach git clean -dfx')
    os.system('git submodule foreach git checkout master')
    os.system('git submodule foreach git pull')

    print(" 开始读取初始化资源")
    getInitConfigData(patrentPath + "/InitRes/initConfig.json")


    print(" 开始拷贝工程到target ")
    copyToTarget(oldPath, newPath)

    print(" 开始拷贝Res到target ")
    oldResPath = patrentPath + "/InitRes"
    newResPath = patrentPath + "/Target_Framework/resource/courseware/assets"
    if "classNameReal" in initConfigData:
        classNameReal = initConfigData["classNameReal"]
        newResPath = patrentPath + "/Target_Framework/resource/" + classNameReal + "/assets"

    copyResToTarget(oldResPath, newResPath, patrentPath)

    print(" 开始生成代码 && 皮肤 ")
    pathMouldConfig = patrentPath + "/CommonMouldScene/模板配置.xls"
    buildCodeTools.initMouldSceneConfigDict(pathMouldConfig)
    newCodePath = patrentPath + "/Target_Framework"
    codeMouldPath = patrentPath + "/CommonMouldScene"
    buildCode(newCodePath, oldResPath, codeMouldPath, patrentPath)

    print(" 开始拷贝不同课件相关的资源 ")
    if not os.path.exists(newCodePath + '/src/' + classNameReal + '/config/'):
        os.makedirs(newCodePath + '/src/' + classNameReal + '/config/')
    shutil.copy(newCodePath + '/src/courseware/config/CoursewareVersion.ts', newCodePath + '/src/' + classNameReal + '/config/' + classNameReal + 'Version.ts')
    shutil.rmtree(newCodePath + '/src/courseware')

    if not os.path.exists(newCodePath + '/resource/' + classNameReal + '/assets/' + classNameReal + '_preload/'):
        os.makedirs(newCodePath + '/resource/' + classNameReal + '/assets/' + classNameReal + '_preload/')
    shutil.copy(newCodePath + '/resource/courseware/courseware.thm.json', newCodePath + '/resource/' + classNameReal + '/' + classNameReal + '.thm.json')
    shutil.copy(newCodePath + '/resource/courseware/config/courseware.json', newCodePath + '/resource/' + classNameReal + '/assets/' + classNameReal + '_preload/' + classNameReal + '.json')
    shutil.rmtree(newCodePath + '/resource/courseware')
    print("开始修改页面json list 代码")
    buildSceneList(newCodePath, classNameReal)
    
    print(" 开始修改代码 ")
    changeCode(newCodePath)

    print("开始压缩图片")
    # print('tiny_compress -c ' + newCodePath + '/resource/')
    os.system('ht_res build ' + newCodePath + ' ' + classNameReal)
    os.system('tiny_compress -c ' + newCodePath + '/resource/')
    



