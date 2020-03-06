class ClickItemForShowPhaseSceneDemo extends ClickItemForShowPhaseScene {

    static key:string = "Page12Scene";

    private cImg1: eui.Image;
    private cImg2: eui.Image;
    private s1: eui.Image;
    private arr1: Array<eui.Image>;
    private s2: eui.Image;
    private arr2: Array<eui.Image>;

    public constructor() {
        super();
        this.skinName = "Page12Scene_Skin";
        this.arr1 = new Array<eui.Image>();
        this.arr2 = new Array<eui.Image>();
    }

    /** 每次进入 */
    public onAdd(): void {
        this.clickItemArr.push(this.cImg1);
        this.clickItemArr.push(this.cImg2);
        
        this.arr1.push(this.s1);
        this.arr2.push(this.s2);
        this.showPhaseArr.push(this.arr1);
        this.showPhaseArr.push(this.arr2);
        super.initScene();
    }
}
