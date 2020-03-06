// from 刘斌毅
// need: this.ImgLeftList        左侧需要运动的图片
//       this.ImgRightList       右侧需要运动的图片   
//       this.ImgHideList        运动完成 需要隐藏的图片
//       this.ImgShowList        运动完成 需要显示的图片
//       this.posLeftOff         左侧图片 移动的偏移量
//       this.posRightOff        右侧图片 移动的偏移量
//       页面需要包含名称为 btnMerge 的图片
// desc: 点击 btnMerge   左侧图片移动一定偏移量  
//                      右侧图片移动一定偏移量  
//                      显示列表 显示
//                      隐藏列表 隐藏
class TweenToCenterSceneDemo extends TweenToCenterScene {

    static key:string = "Page11Scene";

    private img_title:eui.Image;
    private img_left_bg:eui.Image;
    private img_right_bg:eui.Image;
    private img_left_1:eui.Image;
    private img_right_1:eui.Image;

    private img_target_1:eui.Image;
    private img_target_2:eui.Image;
    private img_target_3:eui.Image;

    public constructor() {
        super();
        this.skinName = "Page11Scene_Skin";
    }

    /** 每次进入 */
    public onAdd(): void {

        this.ImgLeftList.push(this.img_left_1)
        this.ImgLeftList.push(this.img_left_bg)

        this.ImgRightList.push(this.img_right_1)
        this.ImgRightList.push(this.img_right_bg)

        this.ImgHideList.push(this.img_left_1)
        this.ImgHideList.push(this.img_right_1)

        this.ImgShowList.push(this.img_target_1)
        this.ImgShowList.push(this.img_target_2)
        this.ImgShowList.push(this.img_target_3)
        this.ImgShowList.push(this.img_title)

        this.posLeftOff = new egret.Point(284 - 72, 0)
        this.posRightOff = new egret.Point(598 - 814, 0)

        super.onAdd()

    }

    /** 这里进行移出场景的处理 **/
    public onDestroy(): void {
        super.onDestroy()
    }
}
