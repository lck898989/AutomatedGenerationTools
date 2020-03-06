class DropAnyToRuleRectScene extends UIObject{
    // protected scene_Ani:egret.tween.TweenGroup;
    // protected scene_Ani_next:egret.tween.TweenGroup;

    // 初始上来有的图片, 需要拖动的图片
    protected ImgList:Array<eui.Image>;
    // 初始图片的坐标
    protected imgPosList:Array<egret.Point>;
    // 拖动规则的Rect
    protected ruleRectList:Array<eui.Rect>;

    private group:eui.Group;
    private curMoveIndex:number;


    public constructor()
    {
        super();

        this.ImgList = [];
        this.ruleRectList = [];
        this.imgPosList = [];
        this.curMoveIndex = -1;

    }

    /** 每次进入 */
    public onAdd():void
    {
        // this.scene_Ani.play(0);

        this.initData();
        this.initAddEvent();
    }
    protected initData(){


        this.curMoveIndex = -1;

        this.imgPosList = [];
        for(let i = 0; i < this.ImgList.length; i++){
            let obj = this.ImgList[i];
            if(obj){
                this.imgPosList.push(new egret.Point(obj.x, obj.y));
            }
        }
    }

    protected initAddEvent():void
    { 
        for(let obj of this.ImgList){
            obj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginEvent, this);
        }
        for(let rectObj of this.ruleRectList){
            rectObj.touchEnabled = false;
        }

        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndLayerEvent, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveLayerEvent, this);

    }



    /** 这里进行移出场景的处理 **/
    public onDestroy():void
    {
        // this.scene_Ani_next.play(0);
        this.resetImgPosForList()
        this.destoryEvent();
        this.destoryData();

    }
    protected resetImgPosForList(){
        for(let index in this.ImgList){
            let obj = this.ImgList[index]
            let pos = this.imgPosList[index]
            if(obj && pos){
                obj.x = pos.x
                obj.y = pos.y
            }
        }
    }
    protected destoryData(){

        this.curMoveIndex = -1;

        delete this.ImgList;
        this.ImgList = [];

        delete this.ruleRectList;
        this.ruleRectList = [];

        delete this.imgPosList;
        this.imgPosList = [];
    }
    protected destoryEvent(){
        for(let obj of this.ImgList){
            obj.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginEvent, this);
        }
        for(let rectObj of this.ruleRectList){
            rectObj.touchEnabled = false;
        }

        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEndLayerEvent, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveLayerEvent, this);

    }

    protected touchBeginEvent(event:egret.TouchEvent):void
    {   

        let curIndex = this.ImgList.indexOf(event.target)
        if(curIndex >= 0){
            
            let childIndex = this.group.numChildren
            this.group.setChildIndex(event.target, childIndex - 1)

            this.curMoveIndex = curIndex
        }

    }

    protected touchMoveLayerEvent(event:egret.TouchEvent):void
    {   

        if(this.curMoveIndex >= 0){
            
            let target= this.ImgList[this.curMoveIndex]
            
            if(target){
                let stageX = event.stageX
                let stageY = event.stageY

                let posTarget = this.globalToLocal(stageX, stageY)
                target.x = posTarget.x - target.width / 2
                target.y = posTarget.y - target.height / 2

                // 给学生发送信令  移动中
                let obj:Object = new Object();
                obj["name"] = this.curMoveIndex.toString();
                obj["targetX"] = target.x;
                obj["targetY"] = target.y;
                CommunicationManager.getInstance().makePostMessage("onFileMessage", "touchMove", obj);

            }
        }
    }

    protected touchEndLayerEvent(event:egret.TouchEvent):void
    {   
        let moveName = ""
        let isResetStr = "true"
        if(this.curMoveIndex >= 0){

            let target= this.ImgList[this.curMoveIndex]
            if(target){

                // 2位以上 位点击的上边
                let stageX = event.stageX
                let stageY = event.stageY
                let siteIndex = this.getSiteIndexForGlobalPos(stageX, stageY)
                if(siteIndex >= 0){

                    // 没有东西  放置数据
                    let posTarget = this.globalToLocal(stageX, stageY)
                    target.x = posTarget.x - target.width / 2
                    target.y = posTarget.y - target.height / 2

                    moveName = this.curMoveIndex.toString()
                    isResetStr = "false"

                } else {

                    if(this.imgPosList[this.curMoveIndex]){
                        let pos = this.imgPosList[this.curMoveIndex]
                        target.x = pos.x
                        target.y = pos.y
                    }

                    moveName = this.curMoveIndex.toString()
                    isResetStr = "true"
                }
            }

            this.curMoveIndex = -1


            // 给学生发送信令  移动中
            let obj:Object = new Object();
            obj["moveName"] = moveName;
            obj["targetX"] = target.x;
            obj["targetY"] = target.y;
            obj["isResetStr"] = isResetStr;
            CommunicationManager.getInstance().makePostMessage("onFileMessage", "touchEndLayer", obj);
        }  

    }
    
    protected getSiteIndexForGlobalPos(xGlobal:number, yGlobal:number):number{
        let localPos = this.globalToLocal(xGlobal, yGlobal)
        let curX = localPos.x
        let curY = localPos.y
        
        for(let siteIndex in this.ruleRectList){
            let rectObj = this.ruleRectList[siteIndex]
            if(rectObj){
                if(rectObj.hitTestPoint(curX, curY)){
                    return parseInt(siteIndex) 
                }
            }
        }
        return -1
    }



    /** 收到信令消息 */
    public execMessage(data:any):void
    {
        if (data["touchMove"]){
            let name:string = data["touchMove"]["name"];
            let targetX:number = Number(data["touchMove"]["targetX"]);
            let targetY:number = Number(data["touchMove"]["targetY"]);
            this.revMoveingHandle(name, targetX, targetY);
        } else if (data["touchEndLayer"]){
            let moveName:string = data["touchEndLayer"]["moveName"];
            let targetX:number = Number(data["touchEndLayer"]["targetX"]);
            let targetY:number = Number(data["touchEndLayer"]["targetY"]);
            let isResetStr:string = data["touchEndLayer"]["isResetStr"];

            this.revMoveEndLayerHandle(moveName, isResetStr, targetX, targetY);
        }
    }
    protected revMoveingHandle(name:string, targetX:number, targetY:number):void
    {   

        if(name && name.length > 0){
            
            if(this.ImgList[name]){
                let targetObj = this.ImgList[name]
                
                if(targetObj){
                    targetObj.x = targetX
                    targetObj.y = targetY

                    let childIndex = this.group.numChildren
                    this.group.setChildIndex(targetObj, childIndex - 1)
                } else {
                    Log.trace("DropAnyToRuleRectScene", "revMoveingHandle data error please check")
                }
            }
        } else {
            Log.trace("DropAnyToRuleRectScene", "revMoveingHandle data error please check")
        }

    }

    /** 接收停止移动 */
    protected revMoveEndLayerHandle(moveIndex:string, isResetStr:string, targetX:number, targetY:number):void
    {   
        

        let target= this.ImgList[moveIndex]
        if(target){

            // 2位以上 位点击的上边
            let stageX = targetX
            let stageY = targetY
            if(isResetStr == "false"){

                // 没有东西  放置数据
                let posTarget = this.globalToLocal(stageX, stageY)
                target.x = posTarget.x 
                target.y = posTarget.y 

            } else {

                if(this.imgPosList[moveIndex]){
                    let pos = this.imgPosList[moveIndex]
                    target.x = pos.x
                    target.y = pos.y
                }

            }
        } else {
            Log.trace("DropAnyToRuleRectScene", "revMoveEndLayerHandle data error please check")
        }

    }
}