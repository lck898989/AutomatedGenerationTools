class TweenToCenterScene extends UIObject{
    // protected scene_Ani:egret.tween.TweenGroup;
    // protected scene_Ani_next:egret.tween.TweenGroup;

    // 初始左边 需要移动的图片
    protected ImgLeftList:Array<eui.Image>;
    protected posLeftList:Array<egret.Point>;
    // 初始右边需要移动的图片
    protected ImgRightList:Array<eui.Image>;
    protected posRightList:Array<egret.Point>;

    // 左侧动画 偏移量
    protected posLeftOff:egret.Point;
    // 右侧动画 偏移量
    protected posRightOff:egret.Point;

    protected ImgHideList:Array<eui.Image>;
    protected ImgShowList:Array<eui.Image>;

    protected numTweenTime:number;
    protected numCurTween:number;

    protected btnMerge:eui.Image;


    public constructor()
    {
        super();

        this.ImgLeftList = [];
        this.ImgRightList = [];
        this.ImgHideList = [];
        this.ImgShowList = [];

        this.numTweenTime = 1000;
    }

    /** 每次进入 */
    public onAdd():void
    {
        // this.scene_Ani.play(0);

        this.initData();
        this.initAddEvent();
    }
    protected initData(){

        this.numCurTween = 0;

        this.posLeftList = []
        for(let index in this.ImgLeftList){
            let obj = this.ImgLeftList[index]
            if(obj){
                this.posLeftList[parseInt(index)] = new egret.Point(obj.x, obj.y)
            }
        }
        this.posRightList = []
        for(let index in this.ImgRightList){
            let obj = this.ImgRightList[index]
            if(obj){
                this.posRightList[parseInt(index)] = new egret.Point(obj.x, obj.y)
            }
        }

        this.resetAllTweenAndPos()
    }
    protected initAddEvent():void
    { 
        this.btnMerge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapEvent, this);
    }

    protected touchTapEvent(event:egret.TouchEvent):void{

        this.startTweenMerge()

        CommunicationManager.getInstance().makePostMessage("onFileMessage", "startTweenMerge", 1);
    }
    protected startTweenMerge(){
        let self = this
        this.numCurTween = 0
        this.resetAllTweenAndPos()
        
        let tweenBackFunc = function(){
            self.removeNumCurTween()
            if(self.numCurTween <= 0){
                // 全部移动完成
                self.endTweenMerge()
            }
        }

        let tweenStartFunc = function(obj:eui.Image, posOff:egret.Point){
            self.addNumCurTween()
            let posX = obj.x + posOff.x
            let posY = obj.y + posOff.y
            egret.Tween.get(obj).to({ x:posX, y:posY}, self.numTweenTime).call(tweenBackFunc);
        }

        for(let obj of this.ImgLeftList){
            tweenStartFunc(obj, this.posLeftOff)
        }
        for(let obj of this.ImgRightList){
            tweenStartFunc(obj, this.posRightOff)
        }
    }
    protected resetAllTweenAndPos(){
        for(let index in this.ImgLeftList){
            let obj = this.ImgLeftList[index]
            let pos = this.posLeftList[index]
            if(obj && pos){
                obj.x = pos.x
                obj.y = pos.y

                egret.Tween.removeTweens(obj)
            }
        }
        for(let index in this.ImgRightList){
            let obj = this.ImgRightList[index]
            let pos = this.posRightList[index]
            if(obj && pos){
                obj.x = pos.x
                obj.y = pos.y

                egret.Tween.removeTweens(obj)
            }
        }
        for(let obj of this.ImgShowList){
            obj.visible = false
        }
        for(let obj of this.ImgHideList){
            obj.visible = true
        }
    }
    protected addNumCurTween(){
        this.numCurTween++
    }
    protected removeNumCurTween(){
        this.numCurTween--
    }
    protected endTweenMerge(){
        for(let obj of this.ImgHideList){
            obj.visible = false
        }
        for(let obj of this.ImgShowList){
            obj.visible = true
        }
    }

    /** 这里进行移出场景的处理 **/
    public onDestroy():void
    {
        // this.scene_Ani_next.play(0);

        this.destoryEvent()
        this.resetData()
        this.destoryData()
        
    }

    protected resetData(){
        this.resetAllTweenAndPos()
    }
    protected destoryData(){

        delete this.ImgLeftList;
        this.ImgLeftList = [];

        delete this.posLeftList;
        this.posLeftList = [];

        delete this.ImgRightList;
        this.ImgRightList = [];

        delete this.posRightList;
        this.posRightList = [];

        delete this.ImgHideList;
        this.ImgHideList = [];

        delete this.ImgShowList;
        this.ImgShowList = [];

    }
    protected destoryEvent(){
        this.btnMerge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapEvent, this);
    }

    public execMessage(data:any):void
    { 
        if (data["startTweenMerge"]){
            this.startTweenMerge()
        }
    }

}