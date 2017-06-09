'use strict';

//Adds a candidate immediately to dropdown (no GET required)
const createCandidateOption = (text, id) => {
   const dropdown = document.getElementById(id);
   const option = document.createElement('option');
   if (dropdown) {
      option.text = text;
      dropdown.add(option);
   }
}

//Removes a candidate immediately from dropdown (no GET required)
const removeCandidateOption = (text, id) => {
   document.getElementById(id)
      .remove(text);
}

//Populates dropdown-vote with the candidates already in the database (needs GET)
const populateDropdown = (data, id) => {
   let autolist = [];
   JSON.parse(data)
      .map((item) => {
         autolist.push(item.name);
      });

   autolist.map((item) => {
      createCandidateOption(item, id);
   });
}

//Populate dropdown-vote with the current candidates when ready
ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', candidatesApiUrl, (response) => {
   populateDropdown(response, 'dropdown-vote');
}));

//Populate dropdown-remove with the current candidates when ready
ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', candidatesApiUrl, (response) => {
   populateDropdown(response, 'dropdown-remove');
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

   if (removeCandidateButton) {
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
   }
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
