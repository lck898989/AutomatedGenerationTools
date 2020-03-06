// from 刘斌毅
// need: this.ImgList 
// desc: 点击屏幕 下一页 this.ImgList 根据索引 按顺序显示
//       如需要 个性显示 请重写 refreshStateView 方法
class OnlyClickSceneDemo extends OnlyClickScene{
    static key:string = "Page2Scene";

    private img_1:eui.Image;

    public constructor()
    {
        super();
        this.skinName = "Page2Scene_Skin";
    }

    /** 每次进入 */
    public onAdd():void
    {   
        this.ImgList.push(this.img_1)
        super.onAdd()
    }

}