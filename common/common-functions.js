'use strict';

const appUrl = window.location.origin;

const p = location.pathname.split('/');
const currentPoll = p[p.length - 1];
const candidatesApiUrl = appUrl + '/api/' + currentPoll + '/candidates/';

const pollsApiUrl = appUrl + '/api/polls/';

//Delete a poll
const deletePoll = () => {
   //   window.confirm();
   if (confirm('Are you sure you want to delete this poll?') == true) {
      home();
      ajaxFunctions.ajaxRequest('DELETE', pollsApiUrl + currentPoll, (response) => {
         console.log(response);
      });
   }
}
