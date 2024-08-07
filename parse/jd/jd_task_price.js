const Template = require('../../template');

class Main extends Template {
    constructor() {
        super()
        this.title = "京东保价"
        this.cron = "38 */10 * * *"
        this.import = ['jdAlgo']
        this.task = 'local'
        this.interval = 5000
    }

    async prepare() {
        this.algo = new this.modules.jdAlgo()
        this.algo.set({
            'appId': 'd2f64',
            'type': 'web',
            "version": "3.1",
        })
    }

    async main(p) {
        let cookie = p.cookie
        let s = await this.curl({
                'url': `https://api.m.jd.com/`,
                'form': `functionId=mlproprice_skuOnceApply_jsf&appid=price_protection&loginType=2&body={"onceBatchId":"","couponConfirmFlag":null,"type":"25"}&client=apple&clientVersion=&x-api-eid-token=jdd03C3HUEKC6G2V5WV6SOXJV5E4J2ILKIIHLPARTU7DKUSMS72ICFUVMMF7ZVZXDON6VLTUCVU2GNZ2RZRMVIDXGF2FBMUAAAAMQFQIBMFAAAAAACIQ46Z6H2VWO6MX&h5st=&t=1718726274981`,
                cookie
            }
        )
        if (this.haskey(s, 'data.succAmount')) {
            this.print(`保价: ${s.data.succAmount}`, p.user)
        }
        else if (this.haskey(s, 'data.confirmCouponInfos.0.couponId')) {
            let onceBatchId = this.haskey(s, 'data.onceBatchId')
            console.log("当前可用优惠券保价")
            let ss = await this.curl({
                    'url': `https://api.m.jd.com/`,
                    'form': `functionId=mlproprice_skuOnceApply_jsf&appid=price_protection&loginType=2&body={"onceBatchId":"${onceBatchId}","couponConfirmFlag":1,"type":"25"}&client=apple&clientVersion=&x-api-eid-token=jdd03UT42BFT33TGS6GOIOWXCCOFR2T5UM44HG27BZ3JBLL5TQWMEHHCGMANY7T3YNDDBPISS4SS7Z7C7T3OFBOP5QFT2KIAAAAMRENKUBUQAAAAACBZLQEQUA7ANXQX&h5st=&t=1722874735852`,
                    cookie
                }
            )
            if (this.haskey(ss, 'data.succAmount')) {
                this.print(`用券保价: ${ss.data.succAmount}`, p.user)
            }
            else {
                console.log(this.haskey(ss, ['data.onceApplyNoSuccessTips', 'data.responseMessage']) || s)
            }
        }
        else {
            console.log(this.haskey(s, ['data.onceApplyNoSuccessTips', 'data.responseMessage']) || s)
        }
    }
}

module.exports = Main;
