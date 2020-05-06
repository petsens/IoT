var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var questions = [
  "2+2=4",
  "1+1=3",
  "2*2=4",
];

var answers = [
  "yes",
  "no",
  "yes"
]

var phrases = [
  "yes",
  "no"
];

var mistakesPara = document.querySelector('.mistakes')
var scorePara = document.querySelector('.score');
var questionPara = document.querySelector('.phrase');
//var nextPhrasePara = document.querySelector('.nextPhrase');
var resultPara = document.querySelector('.result');
var diagnosticPara = document.querySelector('.output');

var testBtn = document.querySelector('button');

var score = 0;
var counter = 0;
var success = 0;

addScore = (scoreAdd) => {
  score = score + scoreAdd;
  console.log("Mistakes = " + score);
  mistakesPara.textContent = "You have made " + score + " mistakes";
}

nextLine = () => {
  console.log("nextLine");
  counter++;
  if(counter == questions.length){
    console.log("Finish");
  }else{
    testSpeech();
  }
};

function testSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = 'Song in progress';

  console.log(counter);
  var question = questions[counter];
  //var nextPhrase = phrases[counter + 1];
  question = question.toLowerCase();
  questionPara.textContent = question;
  //nextPhrasePara.textContent = nextPhrase;
  resultPara.textContent = 'Right or wrong?';
  resultPara.style.background = 'rgba(0,0,0,0.2)';
  diagnosticPara.textContent = '...diagnostic messages';

  var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + question +';';
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
    //õige vastuse kontroll

    if(speechResult === answers[counter-1]){
      console.log(answers[counter-1]);
      resultPara.textContent = 'I heard the correct phrase!';
      resultPara.style.background = 'lime';
      addScore(0);
    }else{
      console.log(answers[counter-1]);
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

testBtn.addEventListener('click', testSpeech);
