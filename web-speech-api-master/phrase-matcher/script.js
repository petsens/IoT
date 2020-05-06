var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var phrases = [
  "Last Christmas I gave you my heart",
  "But the very next day you gave it away",
  "This year to save me from tears",
  "I'll give it to someone special",
  "Last Christmas I gave you my heart",
  "But the very next day you gave it away",
  "This year to save me from tears",
  "I'll give it to someone special"
];

var phrasePara = document.querySelector('.phrase');
var resultPara = document.querySelector('.result');
var diagnosticPara = document.querySelector('.output');

var testBtn = document.querySelector('button');

var score = 0;
var counter = 0;

function testSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = 'Test in progress';

  console.log(counter);
  var phrase = phrases[counter];
  phrase = phrase.toLowerCase();
  phrasePara.textContent = phrase;
  resultPara.textContent = 'Right or wrong?';
  resultPara.style.background = 'rgba(0,0,0,0.2)';
  diagnosticPara.textContent = '...diagnostic messages';

  var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function(event) {
    var speechResult = event.results[0][0].transcript.toLowerCase();
    diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';
    if(speechResult === phrase) {
      resultPara.textContent = 'I heard the correct phrase!';
      resultPara.style.background = 'lime';
      addScore(0);
    } else {
      resultPara.textContent = "That didn't sound right.";
      resultPara.style.background = 'red';
      addScore(1);
    }

    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function() {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = 'Start singing';
    nextLine();
  }

  recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Start singing';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }
  
  // recognition.onaudiostart = function(event) {
  //     //Fired when the user agent has started to capture audio.
  //     console.log('SpeechRecognition.onaudiostart');
  // }
  
  // recognition.onaudioend = function(event) {
  //     //Fired when the user agent has finished capturing audio.
  //     console.log('SpeechRecognition.onaudioend');
  // }
  
  // recognition.onend = function(event) {
  //     //Fired when the speech recognition service has disconnected.
  //     console.log('SpeechRecognition.onend');
  // }
  
  // recognition.onnomatch = function(event) {
  //     //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
  //     console.log('SpeechRecognition.onnomatch');
  // }
  
  // recognition.onsoundstart = function(event) {
  //     //Fired when any sound — recognisable speech or not — has been detected.
  //     console.log('SpeechRecognition.onsoundstart');
  // }
  
  // recognition.onsoundend = function(event) {
  //     //Fired when any sound — recognisable speech or not — has stopped being detected.
  //     console.log('SpeechRecognition.onsoundend');
  // }
  
  // recognition.onspeechstart = function (event) {
  //     //Fired when sound that is recognised by the speech recognition service as speech has been detected.
  //     console.log('SpeechRecognition.onspeechstart');
  // }
  // recognition.onstart = function(event) {
  //     //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
  //     console.log('SpeechRecognition.onstart');
  // }
}

addScore = (scoreAdd) => {
  //console.log('addScore');
  score = score + scoreAdd;
  console.log("Mistakes = " + score);
}

nextLine = () => {
  console.log("nextLine");
  counter++;
  if(counter == phrases.length){
    console.log("Finish");
  }else{
    testSpeech();
  }
};


testBtn.addEventListener('click', testSpeech);
