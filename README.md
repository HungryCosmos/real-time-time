# real-time-time [![Working Demo](https://img.shields.io/badge/demo-running-brightgreen.svg)](https://hungrycosmos.github.io/real-time-time) [![Rawgit](https://img.shields.io/badge/rawgit-v1.0.5-orange.svg)](https://cdn.rawgit.com/HungryCosmos/real-time-time/v1.0.5/dist/umd/real-time-time.min.js)

> Periodically writes current time (and date) of a time zone into configured DOM element.


## About

This library extends functionality of [eztz](https://github.com/HungryCosmos/eztz), allowing it to automatically 
broadcast current time of a remote time zone along with yours time difference into content of specified DOM element. 
It _does not work_ without loaded [eztz](https://github.com/HungryCosmos/eztz) and intended for _in-browser_ use only.  

**Compatibility**: _works_ in my ie 11  


## Quick Start

1. Load latest [eztz](https://github.com/HungryCosmos/eztz) as described in 
[these instructions](https://github.com/HungryCosmos/eztz#installation), or just use [npmjs](https://unpkg.com/) and 
snippet below:  
   ```html
   <script src="https://unpkg.com/eztz@1.1.2/dist/umd/eztz.min.js"></script>
   ```
2. Download packaged [real-time-time.min.js](/dist/umd/real-time-time.min.js) (or other distribution from [repo](/dist))
and load it with from local files, or use [rawgit](https://rawgit.com) at your own risk:  
   ```html
   <script src="https://cdn.rawgit.com/HungryCosmos/real-time-time/v1.0.5/dist/umd/real-time-time.min.js"></script>
   ```
3. Initialize `RealtimeTime` with required params in javascript:  
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <!--metadata-->
   </head>
   <body>
       <!--content-->
       <div id="clock"></div>
 
       <!--IMPORTANT: loading latest eztz-->
       <script src="https://unpkg.com/eztz@1.1.2/dist/umd/eztz.min.js"></script>
    
       <!--loading this library-->
       <script src="https://cdn.rawgit.com/HungryCosmos/real-time-time/v1.0.5/dist/umd/real-time-time.min.js"></script>
 
 
       <!--initialization, see more on configurations below-->
       <script>
           // First, we need to get reference to the element we will print time to, null is for console
           var clock = document.getElementById('clock');
   
           // Take a look at all possible options. You can change what you want right here, but we will skip it for now.
           var DEFAULTS = {
               domElement: null,
               remoteTimezoneOffsetHours: 0,
               intervalDelayMillis: 500,
               timeDisplayFormat: "It's {time} there{diff}",
               timeFormat: {
                   locales: "en-US",
                   options: {
                       month: "short",
                       day: "numeric",
                       hour: "numeric",
                       minute:"numeric",
                       hour12: true
                   }
               },
               diffFormat: {
                   wrapper: " ({diffTxt})",
                   noDiffTxt: "my timezone PogChamp",
                   diffTxt: "{h}h {course} btw",
                   course: {
                       ahead: "ahead",
                       behind: "behind"
                   }
               }
           };
   
           // These must be configured to make the library actually useful
           DEFAULTS.domElement = clock;
           DEFAULTS.remoteTimezoneOffsetHours = +6;
   
           // This is optional, in case we want to see current seconds
           DEFAULTS.timeFormat.options.second = "numeric";
   
           // Remember only to keep template words and curly brackets surrounding it
           DEFAULTS.timeDisplayFormat = "It's {time} there{diff}";
   
           // eg if you delete {diff}, you will lose additional very useful time difference data
           DEFAULTS.timeDisplayFormat = "Boring time: {time}";
   
           // We can pack our custom config into separate object
           var config = {
               domElement: clock,
               remoteTimezoneOffsetHours: +6,
               timeFormat: {
                   options: {
                       second:"numeric"
                   }
               }
           };
   
           // And it will overwrite defaults. Note, RealtimeTime.init(DEFAULTS); will work as well
           RealtimeTime.init(config);
        
           // You can always stop it
           RealtimeTime.destroy();
        
           // And restart
           RealtimeTime.start();
   
           // This lib uses .toLocaleString() to format time
           // More reading on timeFormat, locales and options below:
           // developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString#Using_options
       </script>
   </body>
   ```
4. Good Day Sir!