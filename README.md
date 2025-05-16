# Meditation Timer

This is a simple timer that allows a number of sections to a meditation.
It plays a gong sound at the end of each section of meditation.

see https://www.meditationintervaltimer.co.uk/

## Saving meditations

You can save a mediation and its sections. They are simply saved in the browsers local storage,

## Screen lock request

There is a request in the code to stop the device going into sleep mode. This is released once the meditation completes or is manually stopped. 

## To run 

Pull the code locally. I use npm serve to create a server
https://www.npmjs.com/package/serve but you can use any local server you like.

## Deployment 

The git hub branch main will deploy the code to AWS Amplify at the url https://meditationtimer.orca-tools.com/ and https://www.meditationintervaltimer.co.uk/  