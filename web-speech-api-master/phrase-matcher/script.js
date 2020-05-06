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

var mistakesPara = document.querySelector('.mistakes')
var phrasePara = document.querySelector('.phrase');
var nextPhrasePara = document.querySelector('.nextPhrase');
var resultPara = document.querySelector('.result');
var diagnosticPara = document.querySelector('.output');

var testBtn = document.querySelector('button');

var score = 0;
var counter = 0;

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

function testSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = 'Song in progress';

  console.log(counter);
  var phrase = phrases[counter];
  var nextPhrase = phrases[counter + 1];
  phrase = phrase.toLowerCase();
  phrasePara.textContent = phrase;
  nextPhrasePara.textContent = nextPhrase;
  mistakesPara.textContent = "You have made " + score + " mistakes";
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
}

testBtn.addEventListener('click', testSpeech);
