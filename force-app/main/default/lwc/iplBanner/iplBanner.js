import { LightningElement, wire } from 'lwc';
import {loadStyle} from 'lightning/platformResourceLoader'  // Import method to load external CSS resources
import fetchCricketData from '@salesforce/apex/iplController.fetchCricketData';  // Import Apex method to fetch IPL data
import IPL_Winners from '@salesforce/resourceUrl/IPL_Winners'  // Import static resource for IPL winner images
import iplGlobalStyle from '@salesforce/resourceUrl/iplGlobalStyle' // Import global IPL-specific stylesheet
import winner2024 from '@salesforce/resourceUrl/winner2024' // Import the image for the 2024 IPL winner
export default class IplBanner extends LightningElement {
    fileName='ipl2024stats.json'  // The file name to fetch IPL 2024 statistics
    winner = winner2024 // The image representing the 2024 IPL winner
    carouselList = []  // List of IPL winner images for the carousel
    ipl2024StatsResponse = []  // Array to hold statistics data fetched from the server
    leftStats=[] // Stats to be shown on the left side
    rightStats=[]  // Stats to be shown on the right side

  // Wire method to call Apex and fetch the cricket data based on the dynamic fileName property
    @wire(fetchCricketData, {
        fileName:'$fileName'
    })ipl2024StatsHandler({data, error}){
        if(data){
            console.log("ipl2024StatsHandler data", data)
            let parsedData = JSON.parse(data)   // Parse the JSON response
            this.ipl2024StatsResponse = parsedData.stats    // Store the fetched stats
            const half = Math.ceil(this.ipl2024StatsResponse.length/2)  // Calculate the mid-point for dividing stats into two parts
            this.leftStats = this.ipl2024StatsResponse.slice(0,half)    // Left part of the stats
            this.rightStats = this.ipl2024StatsResponse.slice(half)     // Right part of the stats
        }
        if(error){
            console.error("ipl2024StatsHandler error", error);      // Handle errors in fetching data
        }
    }

    // Lifecycle hook that runs when the component is inserted into the DOM
    connectedCallback(){
        this.onloadStyleMethood() // Load external CSS for the component
        this.generateCarouselList()     // Generate the list of winner images for the carousel
    }

  // Method to load an external CSS file dynamically using platformResourceLoader
    onloadStyleMethood(){
        loadStyle(this,iplGlobalStyle).then(()=>{
            console.log("iplGlobalStyle loaded")    // Success log when stylesheet is loaded
        }).catch(error=>{
            console.log("iplGlobalStyle error", error)      // Error log if stylesheet fails to load
        })
    }

  // Method to generate a list of IPL winner images for the carousel
    generateCarouselList(){
        // Loop through IPL seasons from 2008 to 2023
        for(let i = 2008; i < 2024; i++){
            let url = `${IPL_Winners}/IPL_Winners/${i}.png`  // Generate the image URL for the winner of each year
            let year = i  // Store the year as part of the carousel item
            let altText = `Winners of season ${i}`  // Generate alt text for accessibility
            this.carouselList.push({url,year,altText})  // Add each image, year, and alt text to the carousel list
        }
    }
}