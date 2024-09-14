import { LightningElement, wire } from 'lwc';
import fetchCricketData from '@salesforce/apex/iplController.fetchCricketData';
export default class IplTopPerformances extends LightningElement {

    fileName='ipl2024stats.json'
    keystats = []
    @wire(fetchCricketData, {
        fileName:'$fileName'
    })ipl2024StatsHandler({data, error}){
        if(data){
            console.log("ipl2024StatsHandler data", data)
            let parsedData = JSON.parse(data)
            this.keystats = parsedData.keystats
        }
        if(error){
            console.error("ipl2024StatsHandler error", error);
        }
    }
}