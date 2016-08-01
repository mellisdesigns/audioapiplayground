(function() {
    var context = new AudioContext();  
    var audioElement = document.getElementById("player");    
    var analyser = context.createAnalyser();
    
    audioElement.addEventListener("canplay", function() {
        var source = context.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(context.destination);
    });

    analyser.fftSize = 64;
    
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);
    
    // Setup element selectors
    var allGridItems = document.getElementsByClassName('spectograph__item');
    var spectographContainer = document.getElementsByClassName('spectograph__container')[0]
    var inc = Math.floor(frequencyData.length / allGridItems.length)
    
    // Dropshadow position
    var dropposition = 0;
    
    // Update loop
    function update() {
        
        // Setup next animation frame
        requestAnimationFrame(update);

        // Update frequency data based on the streaming audio
        analyser.getByteFrequencyData(frequencyData);
        
        // Setup animations for the boxes
        for(var i=0; i<allGridItems.length; i++) {
            
            // Use val as a 0 to 1 scaler for any animation types
            var val = frequencyData[i*inc]/255;
            
            // Tween the dropshadow to make it look like it pops off the screen
            TweenMax.to(allGridItems[i], 0.15, {
                boxShadow:"" + (dropposition) + "px " + (dropposition) + "px " + (val*50) + "px #222", 
                delay: Math.random()*0.25});
            
            // Scale Y based off the aplitude of the spectrum
            TweenMax.to(allGridItems[i], 0.5, {
                scaleY: val});
        }
        
        // Background colour should only change based off trigger points
        // TODO: Make this more dynamic and maybe add a hold off timer
        if(frequencyData[18] >= 145) {
            var colour = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
            TweenMax.to(spectographContainer, 1, {backgroundColor: colour, delay: 0.1});
        }
        
        // Pin colours should change based off a beat charge.
        // TODO: Make this more dynamic and maybe a hold off timer
        if(frequencyData[24] >= 120) {
            var colour = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
            for(var i=0; i<allGridItems.length; i++) {
               TweenMax.to(allGridItems[i], 1, {backgroundColor: colour, delay: i*0.05}) 
            }
        }
    };

    // Start the animation loop
    update();
    
})()