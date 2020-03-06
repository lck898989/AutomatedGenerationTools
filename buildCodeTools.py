#!/usr/bin/python
#coding=utf-8
import os
import shutil
import re
import sys
import json
import xlrd
from os import path 

import imp
from imp import reload
reload(sys)
# sys.setdefaultencoding('utf-8')

# 遍历美术资源的时候 赋值
MouldSceneConfigDict = {}   
className = ""

# 生成Exml 皮肤
def buildResExml(path, index):
    print("test buildCode")

def get_file_dir(file):
    """获取文件目录通用函数"""
    fullpath = os.path.abspath(os.path.realpath(file))
    return os.path.dirname(fullpath)

# 初始化模板配置
def initMouldSceneConfigDict(pathMouldConfig):

	if not os.path.exists(pathMouldConfig):
		print ("initMouldSceneConfigDict error path not find")
		return 

	global MouldSceneConfigDict

	# 读取excel
	data = xlrd.open_workbook(pathMouldConfig)
	table = data.sheets()[0] 

	numLine = table.nrows                         #行数
	numLie = table.ncols

	for x in range(1,numLine):
		curType = str(table.cell(x,0).value)
		curName = str(table.cell(x,1).value)
		if len(curType) > 0 and len(curName) > 0:
			MouldSceneConfigDict[curType] = curName
		else:
			print ("initMouldSceneConfigDict error line = " + str(x))

	print (MouldSceneConfigDict)
	
	# MouldSceneConfigDict = {u"1_1":u"OnlyClickScene",
	# u"1_2":u"OnlyClickForBtnScene",
	# u"2_1":u"DragAnyMakeForMaxAndCancleScene",
	# u"2_2":u"DragAnyOptionalChooseBtn",
	# u"3_1":u"DropToRuleRectScene",
	# u"4_1":u"TweenToCenterScene",}


def buildResExml(path, index, configData, codeMouldPath, className):
	
	if not path or not index:
		print ("buildResExml error 参数错误")
		return 

	global MouldSceneConfigDict
	if configData and configData["type"] != None and configData["type"] in MouldSceneConfigDict:
		# 单纯的点击多显示一张图片
		if configData["type"] == u"1_1":
			buildResExmlOnlyClick(path, index, configData, codeMouldPath, className)
		else:
			mouldName = MouldSceneConfigDict[configData["type"]]
			buildResExmlForRule(path, index, None, codeMouldPath, mouldName, className)

	else:
		buildResExmlDefault(path, index, codeMouldPath, className)

def buildResExmlForRule(path, index, configData, codeMouldPath, mouldName, className):
	#原始文件路径
	
	mouldDemoPath = codeMouldPath + "/" + mouldName + "/" + mouldName + "Demo_Skin.exml"
	#工程里文件路径
	name = className + "_Page" + str(index) + "Scene"
	targetDemoPath = path + "/" + name + "/" + name + "_Skin.exml"


	if not os.path.exists(mouldDemoPath):
		print ("buildResExmlForRule error path = " + mouldDemoPath)
		return 


	targetDemoDirPath = get_file_dir(targetDemoPath)
	if not os.path.exists(targetDemoDirPath):
        #创建文件夹
		os.mkdir(targetDemoDirPath) 

	# 拷贝父类
	print ("buildResExmlForRule path = " + targetDemoPath)
	# 拷贝文件
	shutil.copy(mouldDemoPath,targetDemoPath)

	oldClassName = 'class="' + mouldName + 'Demo_Skin"'
	newClassName = 'class="' + name + '_Skin"'

	oldBgName = 'id="img_bg"'
	newBgName = '		<e:Image id="img_bg" scaleX="1" scaleY="1" source="' + className + '_page_scene_bg' + str(index) + '_jpg" x="0" y="0"/>\n'

	zz = open(targetDemoPath, "r+", encoding="utf-8")
	lines = zz.readlines()

	if len(lines) > 0 :
	    zz.seek(0)
	    zz.truncate()

	    for lineIndex, strA in enumerate(lines):

	        strNew = strA

	        if (strNew.find(oldBgName)) > -1:
	        	strNew = newBgName
	        else:
	        	pass

	        strNew = strNew.replace(oldClassName, newClassName)

	        zz.write(strNew)

	zz.close()


# 单纯的点击多显示一张图片
def buildResExmlOnlyClick(path, index, configData, codeMouldPath, className):
	mouldName = "OnlyClickScene"
	buildResExmlForRule(path, index, configData, codeMouldPath, mouldName, className)

def buildResExmlDefault(path, index, codeMouldPath, className):
	mouldName = "DefaultScene"
	buildResExmlForRule(path, index, None, codeMouldPath, mouldName, className)









# 生成场景代码 			configData(Json) 
def buildCodeScene(path, index, configData, codeMouldPath, className):

	if not path or not index:
		print ("buildCodeScene error 参数错误")
		return 

	global MouldSceneConfigDict
	if configData and configData["type"] != None and configData["type"] in MouldSceneConfigDict:
		# 单纯的点击多显示一张图片
		if configData["type"] == u"1_1":
			buildCodeSceneOnlyClick(path, index, configData, codeMouldPath, className)
		else:
			mouldName = MouldSceneConfigDict[configData["type"]]
			buildCodeSceneForRule(path, index, configData, codeMouldPath, mouldName, className)

	else:
		buildCodeSceneDefault(path, index, codeMouldPath, className)
		# pass


# 生成默认场景
def buildCodeSceneDefault(path, index, codeMouldPath, className):
	#原始文件路径
	mouldName = "DefaultScene"
	mouldDemoPath = codeMouldPath + "/" + mouldName + "/" + mouldName + "Demo.ts"
	#工程里文件路径
	name = className + "_Page" + str(index) + "Scene"
	targetDemoPath = path + "/" + name + "/" + name + ".ts"

	if not os.path.exists(mouldDemoPath):
		print ("buildCodeSceneDefault error path = " + mouldDemoPath)
		return 


	targetDemoDirPath = get_file_dir(targetDemoPath)
	if not os.path.exists(targetDemoDirPath):
        #创建文件夹
		os.mkdir(targetDemoDirPath) 

	# 拷贝父类
	print ("buildCodeSceneDefault path = " + targetDemoPath)
	# 拷贝文件
	shutil.copy(mouldDemoPath,targetDemoPath)

	targetClassDesc = "class " 
	targetStaticKeyDesc = "static"
	targetStaticKeyDesc2 = "key"
	targetThisSkinName = "this.skinName"

	zz = open(targetDemoPath, "r+", encoding="utf-8");
	lines = zz.readlines()

	if len(lines) > 0 :
		zz.seek(0)
		zz.truncate()

		for lineIndex, strA in enumerate(lines):

			strNew = strA

			if (strNew.find(targetClassDesc)) > -1:
				strNew = "class " + name + " extends UIObject {" + "\n";
			else:
				pass
			if (strNew.find(targetStaticKeyDesc)) > -1 and (strNew.find(targetStaticKeyDesc2)) > -1:
				strNew = '    static key:string = "' + name + '";' + "\n";
			else:	
				pass

			if (strNew.find(targetThisSkinName)) > -1:
				strNew = '        this.skinName = "' + name + '_Skin";' + "\n";
			else:
				pass

			zz.write(strNew)

	zz.close()


# 单纯的点击多显示一张图片
def buildCodeSceneOnlyClick(path, index, configData, codeMouldPath, className):
	mouldName = "OnlyClickScene"
	buildCodeSceneForRule(path, index, configData, codeMouldPath, mouldName, className)


def buildCodeSceneForRule(path, index, configData, codeMouldPath, mouldName, className):

	#原始文件路径
	mouldDemoPath = codeMouldPath + "/" + mouldName + "/" + mouldName + "Demo.ts"
	mouldParentPath = codeMouldPath + "/" + mouldName + "/" + mouldName + ".ts"
	#工程里文件路径
	name = className + "_Page" + str(index) + "Scene"
	targetDemoPath = path + "/" + name + "/" + name + ".ts"
	targetParentPath = path + "/CommonMouldScene/" + mouldName + ".ts"

	if not os.path.exists(mouldParentPath):
		print ("buildCodeSceneOnlyClick error path = " + mouldParentPath)
		return 
	if not os.path.exists(mouldDemoPath):
		print ("buildCodeSceneOnlyClick error path = " + mouldDemoPath)
		return 

	targetParentDirPath = get_file_dir(targetParentPath)
	if not os.path.exists(targetParentDirPath):
        #创建文件夹
		os.mkdir(targetParentDirPath) 
	targetDemoDirPath = get_file_dir(targetDemoPath)
	if not os.path.exists(targetDemoDirPath):
        #创建文件夹
		os.mkdir(targetDemoDirPath) 

	# 拷贝父类
	# print ("buildCodeSceneForRule path = " + targetParentPath)
	print ("buildCodeSceneForRule path = " + targetDemoPath)
	shutil.copy(mouldParentPath,targetParentPath)
	# 拷贝文件
	shutil.copy(mouldDemoPath,targetDemoPath)

	targetClassDesc = "class " 
	targetStaticKeyDesc = "static"
	targetStaticKeyDesc2 = "key"
	targetThisSkinName = "this.skinName"

	zz = open(targetDemoPath, "r+", encoding="utf-8")
	lines = zz.readlines()
	if len(lines) > 0 :
		zz.seek(0)
		zz.truncate()

		for lineIndex, strA in enumerate(lines):

			strNew = strA

			if strNew.find(targetClassDesc) > -1:
				strNew = "class " + name + " extends " + mouldName + "{\n";
			else:
				pass
			if strNew.find(targetStaticKeyDesc) > -1 and strNew.find(targetStaticKeyDesc2) > -1:
				strNew = '    static key:string = "' + name + '";' + "\n";
			else:
				pass
			if strNew.find(targetThisSkinName) > -1:
				strNew = '        this.skinName = "' + name + '_Skin";' + "\n";
			else:
				pass


			zz.write(strNew)

	zz.close()















if __name__=="__main__":
    
    initMouldSceneConfigDict("/Users/lby/Work/htsw/autoPython/CommonMouldScene/模板配置.xls")


