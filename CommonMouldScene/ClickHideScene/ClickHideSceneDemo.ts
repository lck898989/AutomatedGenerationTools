// from 刘斌毅
// need: this.ImgSelectedList
// desc: 点击隐藏
class ClickHideSceneDemo extends ClickHideScene{

    static key:string = "Page11Scene";

    private img_1:eui.Image
    private img_2:eui.Image
    private img_3:eui.Image
    private img_4:eui.Image
    private img_5:eui.Image
    private img_6:eui.Image
    private img_7:eui.Image
    private img_8:eui.Image
    private img_9:eui.Image

    public constructor() {
        super();
        this.skinName = "Page11Scene_Skin";
    }

    /** 每次进入 */
    public onAdd(): void {

        this.ImgSelectedList.push(this.img_1)
        this.ImgSelectedList.push(this.img_2)
        this.ImgSelectedList.push(this.img_3)
        this.ImgSelectedList.push(this.img_4)
        this.ImgSelectedList.push(this.img_5)
        this.ImgSelectedList.push(this.img_6)
        this.ImgSelectedList.push(this.img_7)
        this.ImgSelectedList.push(this.img_8)
        this.ImgSelectedList.push(this.img_9)

        super.onAdd()
    }

}
