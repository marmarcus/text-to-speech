onload = function() {
    if ('speechSynthesis' in window){
        var synth = speechSynthesis;
        var flag = false;

            if(synth.speaking){ /* stop narration */
                /* for safari */
                flag = false;
                synth.cancel();
            }

        /* references to the buttons */
        var playEle = document.querySelector('#listen');
        var pauseEle = document.querySelector('#pause');
        var stopEle = document.querySelector('#stop');

        /* click event handlers for the buttons */
        playEle.addEventListener('click', onClickPlay);
        pauseEle.addEventListener('click', onClickPause);
        stopEle.addEventListener('click', onClickStop);

// select voices////
//var synth = window.speechSynthesis;s

var voiceSelect = document.querySelector("select");

var voices = [];

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
  });
  var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = '';
  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';        

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    if(voices[i].lang == "en-US" || voices[i].lang == "en-GB"){
        voiceSelect.appendChild(option);        
    }
  }
  voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}
//end select voices

        function onClickPlay() {
            if(!flag){
                flag = true;
                let utterance = new SpeechSynthesisUtterance();
                utterance.rate = 1.1; /* Adjust voice speed */
                utterance.volume = .7; /* Adjust voice volume */
                utterance.text = document.querySelector("textarea").value;

                //add voice//
                var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
                    for(i = 0; i < voices.length ; i++) {
                      if(voices[i].name === selectedOption) {
                        utterance.voice = voices[i];
                        break;
                      }
                    }
                utterance.onend = function(){
                    flag = false;
                };
                
                synth.speak(utterance);

                //fix stop after a while bug
                let r = setInterval(() => {
                  console.log(speechSynthesis.speaking);
                  if (!speechSynthesis.speaking) {
                    clearInterval(r);
                  } else {
                    speechSynthesis.resume();
                  }
                }, 14000);
            }
            if(synth.paused) { /* unpause/resume narration */
                synth.resume();
            }
        }
        function onClickPause() {
            if(synth.speaking && !synth.paused){ /* pause narration */
                synth.pause();
            }
        }
        function onClickStop() {
           if(synth.speaking){ /* stop narration */
                /* for safari */
                flag = false;
                synth.cancel();
            }
        }
    }
}