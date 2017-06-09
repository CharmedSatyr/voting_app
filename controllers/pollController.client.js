'use strict';

//Go to a specified poll
const goToPoll = (title) => {
   const pollUrl = appUrl + '/polls/' + title;
   window.location = pollUrl;
};

//Creates a poll button in the 'existingPolls' section
const createPollButton = (text) => {

   const existingPolls = document.getElementById('existingPolls');
   const btn = document.createElement('button');
   const t = document.createTextNode(text);
   btn.appendChild(t);
   btn.title = text;
   const fn = () => {
      goToPoll(text);
   };
   btn.onclick = fn;

   existingPolls.appendChild(btn);

   const br = document.createElement('br');
   existingPolls.appendChild(br);
}

//Populates existing with the candidates already in the database
const populatePolls = (data) => {
   let autolist = [];
   JSON.parse(data)
      .map((item) => {
         autolist.push(item.title);
      });

   autolist.map((item) => {
      createPollButton(item);
   });
}

//Executes populatePolls on the information from pollsApiUrl
ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', pollsApiUrl, populatePolls));

//Initiates an event listener for the submitPollTitleButton and creates a new poll based on the submission
(() => {
   const submitPollTitleButton = document.getElementById('submitPollTitleButton');

   if (submitPollTitleButton) {
      submitPollTitleButton.addEventListener('click', () => {

         const pollSubmitted = document.getElementById('enterPollTitle')
            .value;

         ajaxFunctions.ajaxRequest('POST', pollsApiUrl + pollSubmitted, (response) => {
            console.log(response);
         });

         //Immediately add to existingPolls
         createPollButton(pollSubmitted);

      }, false);
   }
})();
