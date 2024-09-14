import { LightningElement, wire } from 'lwc';
import fetchCricketData from '@salesforce/apex/IplController.fetchCricketData' // Import Apex method to fetch cricket data
import IPL_Images_and_logos from '@salesforce/resourceUrl/IPL_Images_and_logos' // Import static resource URL for IPL images and logos
import {publish, MessageContext} from 'lightning/messageService'; // Import methods for message service communication
import MSG_SERVICE from '@salesforce/messageChannel/Record_Selected__c' // Import custom message channel for publishing messages

// Define a mapping object for different cricket KPIs and their corresponding labels
const labelMap={
    "MostRuns":"RUNS",
    "MostWickets":"WICKETS",
    "MostFours":"FOURS",
    "MostSixes":"SIXES",
    "HighestScore":"SCORE",
    "BestStrikeRate":"SR"

}
export default class IplAllTimeLeaders extends LightningElement {


    fileName='onAllTimeLeaders.json' // Name of the file to fetch cricket data
    allLeaders=[] // Array to store all-time cricket leaders' data

    // Wire the MessageContext for the lightning message service to publish messages
    @wire(MessageContext)
    messageContext
  
    // Wire method to call Apex and fetch data, passing the dynamic fileName parameter
    @wire(fetchCricketData, {
        fileName:'$fileName'
    })onAllTimeLeadersHandler({data, error}){
        if(data){
            console.log("onAllTimeLeadersHandler data", data)

            // Parse the fetched data
            let parsedData = JSON.parse(data)
            const allLeaders = parsedData.allTimeLeaders

            // Process the data and build the player image and team logo URLs dynamically
            this.allLeaders = allLeaders.map(item=>{
                let player_image = `${IPL_Images_and_logos}/IPL_Images_and_logos/${item.PLAYER_NAME.replaceAll(' ','')}.png`
                let team_logo = `${IPL_Images_and_logos}/IPL_Images_and_logos/${item.TEAM_CODE}.png`
                const label = labelMap[item.KPIType] // Get label for KPIType using labelMap
                
                return {
                    ...item, player_image, team_logo,
                    label
                }
            })
            // Publish the message with the first player's KPIType and title
            const {title, KPIType} = this.allLeaders[0]
            this.publishMessage(KPIType, title)
        }

        // Handle any error in fetching data
        if(error){
            console.error("onAllTimeLeadersHandler error", error)
        }
    }


    // Method to publish messages to the message channel
    publishMessage(filename, title){
        // publish(messageContext, messageChannel, message)
        const payload={
            fileName:{
                name:filename, 
                title:title
            }
        }
        // Publish the payload to the custom message channel
        publish(this.messageContext, MSG_SERVICE, payload)
    }

    // Event handler for click actions, used to publish messages based on clicked element's dataset
    clickHandler(event){
        const {filename, title}= event.target.dataset
        this.publishMessage(filename, title)
    }


}