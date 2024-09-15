import { LightningElement, api } from 'lwc';

export default class IplCustomCarousel extends LightningElement {
    @api carouselList=[]
    itemIndex = 0
    carouselPanelsStyle =''

    connectedCallback(){
        window.setInterval(()=>{
            this.nextSlide()
        }, 5000)
    }

    nextSlide(){
        this.itemIndex = (this.itemIndex+1) % this.carouselList.length
        this.carouselPanelsStyle = `transform:translateX(-${this.itemIndex*100}%)`
    }
}