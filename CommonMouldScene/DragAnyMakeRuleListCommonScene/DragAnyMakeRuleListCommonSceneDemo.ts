// from 刘斌毅
// need:    this.ImgList        可以拖动的列表             锚点需要在中心
//          this.rectCanSetList   可以放置的位置列表          锚点需要在中心 
//          可选                  countImgList            可放置数量  默认9999
// desc:    点击图片       拖动图片 
//          拖动        
//          拖动结束       可放置区域放置 随意放置
//          isCanSetToRect                              是否可以放置到rect
//          refreshForListTouchEnd                      每次点击结束都调用
//          getDataFromTargetDataMap                    从拖动出来的对象里 获取data
//          removeToTarget                              从拖动出来的对象里 移除
//          pushToTarget                                添加到 拖动出来的对象里 
class DragAnyMakeRuleListCommonSceneDemo extends DragAnyMakeRuleListCommonScene {

    static key:string = "Page8Scene";

    private btnNext:eui.Image

    private rect_1:eui.Rect

    private img_1:eui.Image
    private img_2:eui.Image
    private img_3:eui.Image





    // 子类数据
    private curIndexLineSelf:number = 0
    private targetMap = {}
    private curListTarget = {}
    private targetPosMap = {}

    public constructor() {
        super();
        this.skinName = "Page8Scene_Skin";
    }

    /** 每次进入 */
    public onAdd(): void {

        this.ImgList.push(this.img_1)
        this.ImgList.push(this.img_2)
        this.ImgList.push(this.img_3)

        this.countImgList.push(1)
        this.countImgList.push(4)
        this.countImgList.push(6)

        this.rectCanSetList.push(this.rect_1)

        super.onAdd();

        this.curIndexLineSelf = 0;
        this.targetMap["_50_1_20_2_10_1"] = "lable_t7_1"
        this.targetMap["_50_1_20_1_10_3"] = "lable_t7_2"
        this.targetMap["_50_1_20_0_10_5"] = "lable_t7_3"
        this.targetMap["_50_0_20_4_10_2"] = "lable_t7_4"
        this.targetMap["_50_0_20_3_10_4"] = "lable_t7_5"
        this.targetMap["_50_0_20_2_10_6"] = "lable_t7_6"
        
        this.targetPosMap = {}
        this.targetPosMap[1] = {x:954.22, y:313.91}
        this.targetPosMap[2] = {x:954.22, y:435.5}
        this.targetPosMap[3] = {x:954.22, y:563.3}
        this.targetPosMap[4] = {x:954.22, y:689.15}
        this.targetPosMap[5] = {x:954.22, y:810.7}
        this.targetPosMap[6] = {x:954.22, y:936.03}

        this.curListTarget = {}
        
        this.initLable()
        this.btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapNextEvent, this);
    }


    /** 这里进行移出场景的处理 **/
    public onDestroy():void{

        super.onDestroy();

        this.btnNext.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapNextEvent, this);
    }

    public execMessage(data:any):void{ 
        super.execMessage(data)

        if (data["next"]){

            this.curIndexLineSelf++

            this.resetData()
            this.refreshForListTouchEnd()
        }
    }

    protected touchTapNextEvent(event:egret.TouchEvent):void{
        
        this.curIndexLineSelf++

        this.resetData()
        this.refreshForListTouchEnd()

        CommunicationManager.getInstance().makePostMessage("onFileMessage", "next", 1);
        
    }
    private initLable(){
        for(let i = 1; i <= 6; i++){
            let lable1 = this["lable_" + i + "_1"]
            let lable2 = this["lable_" + i + "_2"]
            let lable3 = this["lable_" + i + "_3"]
            let lable4 = this["lable_t7_" + i]
            if(lable1){
                lable1.visible = false
            }
            if(lable2){
                lable2.visible = false
            }
            if(lable3){
                lable3.visible = false
            }
            if(lable4){
                lable4.visible = false
            }
        }
    }
    protected refreshForListTouchEnd(){
        super.refreshForListTouchEnd()

        this.refreshViewList()

    }

    private refreshViewList(){
        let lable1:eui.Label = this["lable_" + this.curIndexLineSelf + "_1"]
        let lable2:eui.Label = this["lable_" + this.curIndexLineSelf + "_2"]
        let lable3:eui.Label = this["lable_" + this.curIndexLineSelf + "_3"]

        if(lable1 && lable2 && lable3){
            let key = ""
            lable1.text = this.curNumImgList[0].toString()
            lable1.visible = true
            key += "_50_" + this.curNumImgList[0]
            lable2.text = this.curNumImgList[1].toString()
            lable2.visible = true
            key += "_20_" + this.curNumImgList[1]
            lable3.text = this.curNumImgList[2].toString()
            lable3.visible = true
            key += "_10_" + this.curNumImgList[2]

            // 结果
            if(this.targetMap[key]){
                if(!this.curListTarget[key]){
                    let targetName = this.targetMap[key]
                    this.curListTarget[key] = this.curIndexLineSelf

                    let lable4:eui.Label = this[targetName]
                    if(lable4){
                        lable4.visible = true
                        lable4.x = this.targetPosMap[this.curIndexLineSelf].x
                        lable4.y = this.targetPosMap[this.curIndexLineSelf].y
                    }
                }
            }
        } 
    }

}

