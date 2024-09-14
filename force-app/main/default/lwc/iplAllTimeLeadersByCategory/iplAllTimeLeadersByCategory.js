import { LightningElement, wire } from 'lwc';
import {subscribe, MessageContext, unsubscribe, APPLICATION_SCOPE} from 'lightning/messageService'; // Importing methods for subscribing and unsubscribing to/from message channels
import MSG_SERVICE from '@salesforce/messageChannel/Record_Selected__c' // Importing custom message channel for record selection
import fetchCricketData from '@salesforce/apex/IplController.fetchCricketData' // Import Apex method to fetch cricket data based on file
import IPL_Images_and_logos from '@salesforce/resourceUrl/IPL_Images_and_logos' // Import static resource for IPL images and logos
export default class IplAllTimeLeadersByCategory extends LightningElement {
    heading
    fileName
    subscription // Stores the subscription reference to unsubscribe later
    records =[] // Array to store records fetched from the server

    // Wire the MessageContext for the lightning message service
    @wire(MessageContext)
    messageContext

    // Wire method to call Apex and fetch data dynamically based on the fileName property
    @wire(fetchCricketData, {
        fileName:'$fileName'
    })leadersByCatgeoryHandler({data, error}){
        if(data){
            console.log("leadersByCatgeoryHandler data", data)

            // Parse the fetched data and map it to create image URLs dynamically for each player
            let parsedData = JSON.parse(data)
            this.records = parsedData.map((item, index)=>{
                let player_image = `${IPL_Images_and_logos}/IPL_Images_and_logos/${item.StrikerName?.replaceAll(' ', '')}.png` // Generate player image path
                return {...item, pos:index+1, player_image}  // Add player's position and image path to the record
            })
        }
        if(error){
            console.error("leadersByCatgeoryHandler error", error)
        }
    }

    // Error handler for broken images - set a default image if player image fails to load
    errorHandler(event){
        event.target.src= `${IPL_Images_and_logos}/IPL_Images_and_logos/default.png` // Fallback to a default image in case of an error
    }

    // Conditional rendering logic to show data based on the selected file category
    get showWickets(){
        return this.fileName === "MostWickets.json"  // Returns true if the current fileName is 'MostWickets.json'
    }
    get showRuns(){
        return this.fileName !== "MostWickets.json"  // Returns true for all file names other than 'MostWickets.json'
    }

    // Lifecycle hook that runs when the component is inserted into the DOM
    connectedCallback(){
        this.subscribeToMessageChannel()  // Subscribe to the message channel to listen for data updates
    }

    // Method to subscribe to the custom message channel for receiving messages
    subscribeToMessageChannel() {
        // subscribe(messageContext, messageChannel, listener, subscriberOptions)
        // Check if the subscription is already active
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,  // The MessageContext to use
                MSG_SERVICE,  // The custom message channel
                (message) => this.handleMessage(message),  // The callback function to handle incoming messages
                { scope: APPLICATION_SCOPE }  // The subscription scope to listen across the entire application
            );
        }
    }

    // Method to handle the message received from the message channel
    handleMessage(message){
        console.log("Message", message)
        this.heading = `TOP 5 ${message.fileName.title} OF ALL TIME`  // Update the heading text based on the received message data
        this.fileName = message.fileName.name+'.json' // Set the fileName property dynamically to fetch relevant data
    }

    // Lifecycle hook that runs when the component is removed from the DOM
    disconnectedCallback(){
        // unsubscribe(subscription)
        // Unsubscribe from the message channel when the component is destroyed
        unsubscribe(this.subscription)
        this.subscription = null  // Reset the subscription reference
    }
}