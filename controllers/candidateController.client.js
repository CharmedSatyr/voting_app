'use strict';

//Adds a candidate immediately to dropdown (no GET required)
const createCandidateOption = (text, id) => {
   const option = document.createElement('option');
   option.text = text;
   document.getElementById(id)
      .add(option);
}

//Removes a candidate immediately from dropdown (no GET required)
const removeCandidateOption = (text, id) => {
   document.getElementById(id)
      .remove(text);
}

//Populates 2 dropdowns with the candidates already in the database (needs GET)
const populateDropdown = (data, id1, id2) => {
   let autolist = [];
   JSON.parse(data)
      .map((item) => {
         autolist.push(item.name);
      });

   autolist.map((item) => {
      createCandidateOption(item, id1);
   });
   autolist.map((item) => {
      createCandidateOption(item, id2);
   });
}

//Populate dropdown-vote and dropdown-remove with the current candidates when ready
ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', candidatesApiUrl, (response) => {
   populateDropdown(response, 'dropdown-vote', 'dropdown-remove');
}));

//When a new candidate is added, it will be immediately added to the dropdowns and also submitted to the database
(() => {
   const submitCandidateButton = document.getElementById('submitCandidateButton');

   submitCandidateButton.addEventListener('click', () => {

      const candidateSubmitted = document.getElementById('enterCandidate')
         .value;

      ajaxFunctions.ajaxRequest('PUT', candidatesApiUrl + candidateSubmitted, (response) => {
         console.log(response);
      });

      //Immediately add to dropdowns
      createCandidateOption(candidateSubmitted, 'dropdown-vote');
      createCandidateOption(candidateSubmitted, 'dropdown-remove');
      //Update the chart with the new label
      updateChart();

   }, false);

})();

//When a candidate is removed, it will be immediately removed from the dropdowns and also removed from the database
(() => {
   const removeCandidateButton = document.getElementById('removeCandidateButton');

   removeCandidateButton.addEventListener('click', () => {

      const remove = document.getElementById('dropdown-remove')
         .value;

      ajaxFunctions.ajaxRequest('DELETE', candidatesApiUrl + remove, (response) => {
         console.log(response);
      });

      //Immediately remove from dropdown
      removeCandidateOption(remove, 'dropdown-vote');
      removeCandidateOption(remove, 'dropdown-remove');
      //Update the chart with the new label
      updateChart();

   }, false);

})();

//Vote for a specified candidate in the dropdown
const voteForCandidate = () => {
   const vote = document.getElementById('dropdown-vote')
      .value;

   ajaxFunctions.ajaxRequest('POST', candidatesApiUrl + vote, (response) => {
      console.log(response)
   });
   updateChart();
};
