'use strict';

const appUrl = window.location.origin;

const p = location.pathname.split('/');
const currentPoll = p[p.length - 1];
const candidatesApiUrl = appUrl + '/api/' + currentPoll + '/candidates/';

const pollsApiUrl = appUrl + '/api/polls/';

//Delete a poll and go back to the main /polls page
const deletePoll = () => {

   if (confirm('Are you sure you want to delete this poll?') == true) {

      ajaxFunctions.ajaxRequest('DELETE', pollsApiUrl + currentPoll, (response) => {
         console.log(response);
      });
      window.location = appUrl + '/polls';
   }
}
