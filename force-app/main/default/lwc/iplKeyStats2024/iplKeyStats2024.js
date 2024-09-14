import { api, LightningElement } from 'lwc';
import IPL_Images_and_logos from '@salesforce/resourceUrl/IPL_Images_and_logos'
export default class IplKeyStats2024 extends LightningElement {
    @api keystatsvalue

    get playerImage(){
        // ?. --> optional chaining operator 
        let name = this.keystatsvalue?.name?.replaceAll(' ','')
        return `${IPL_Images_and_logos}/IPL_Images_and_logos/${name}.png`
    }

    get bgclass(){
        let bgClassName = this.keystatsvalue?.category?.replaceAll(' ','')+'_bg'
        return `slds-grid slds-wrap stats-box ${bgClassName}` 
    }
}