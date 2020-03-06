/**
 * 
 */
class TimeManager_Scene4 extends ClockTouchScene {
    static key: string = "TimeManager_Scene4";

    private hourImg: eui.Image;
    private secImg: eui.Image;

    public constructor() {
        super();
        this.skinName = "TimeManager_Scene4_Skin";
    }

    public onAdd() : void {
        // 指针初始值
        this.hourImg.rotation = 210;
        this.secImg.rotation = 0;
        this.clockImgArr.push(this.hourImg);
        this.clockImgArr.push(this.secImg);

        super.onAdd();
    }
}