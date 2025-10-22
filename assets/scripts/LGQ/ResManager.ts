

export default class ResManager extends cc.Component {
    private static _I: ResManager = null;
    static get I() {
        if (!this._I) {
            this._I = new ResManager();
            this._I.init();
        }
        return this._I;
    }

    private bundle: cc.AssetManager.Bundle = null;


    init() {
        this.bundle = cc.assetManager.getBundle("bundles");
    }

    //加载bundle下预制体
    loadBundlePrefab(url, func) {
        if (!this.bundle) {
            this.bundle = cc.assetManager.getBundle("bundles");
        }
        this.bundle.load(url, cc.Prefab, (err, assets) => {
            if (err) {
                return;
            }
            func && func(assets);
        });
    }

    preloadBundlePrefab(url, func, finishFunc?) {
        if (!this.bundle) {
            this.bundle = cc.assetManager.getBundle("bundles");
        }
        this.bundle.preload(url, (finish, total) => {
            func && func(finish, total);
        }, finishFunc);
    }

    //加载resources下预制体
    loadResPrefab(url, func) {
        cc.resources.load(url, cc.Prefab, (err, assets) => {
            if (err) {
                return;
            }
            func && func(assets);
        });
    }

    //加载bundle下图片
    loadBundlePic(url, func) {
        if (!this.bundle) {
            this.bundle = cc.assetManager.getBundle("bundles");
        }
        this.bundle.load(url, cc.SpriteFrame, (err, assets) => {
            if (err) {
                return;
            }
            func && func(assets);
        });
    }
    //加载远程图片
    loadRemotePic(url, func) {
        cc.assetManager.loadRemote(url, (err, assets) => {
            if (err) {
                return;
            }
            func && func(assets);
        });
    }

    changeBundlePic(node, url, func?) {
        this.loadBundlePic(url, (spr) => {
            if (!cc.isValid(node)) {
                return;
            }
            let sp: cc.Sprite = node.getComponent(cc.Sprite);
            if (!sp) {
                return;
            }
            sp.spriteFrame = spr;
            func && func();
        });
    }

    changePic(node, url) {
        if (!url || url =="") {
            return;
        }
        this.loadRemotePic(url, (tex) => {
            if (!cc.isValid(node)) {
                return;
            }
            
            let sp: cc.Sprite = node.getComponent(cc.Sprite);
            if (!sp) {
                return;
            }
            sp.spriteFrame = new cc.SpriteFrame(tex);
        });
    }

    //加载bundle下骨骼动画
    loadBundleSpine(url, func) {
        if (!this.bundle) {
            this.bundle = cc.assetManager.getBundle("bundles");
        }
        this.bundle.load(url, sp.SkeletonData, (err, spData) => {
            if (err) {
                return;
            }
            func && func(spData);
        });
    }

    setGray(node: cc.Node, isGray) {
        if (cc.isValid(node)) {
            let arrSprite = node.getComponentsInChildren(cc.Sprite);
            for (let i = 0; i < arrSprite.length; i++) {
                let sp = arrSprite[i];
                if (sp) {
                    if (isGray) {
                        sp.setMaterial(0, cc.Material.getBuiltinMaterial("2d-gray-sprite"));
                    } else {
                        sp.setMaterial(0, cc.Material.getBuiltinMaterial("2d-sprite"));
                    }
                }
            }
        }
    }
}
