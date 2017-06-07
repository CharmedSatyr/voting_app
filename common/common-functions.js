'use strict';

const appUrl = window.location.origin;

const p = location.pathname.split('/');
const currentPoll = p[p.length - 1];
const candidatesApiUrl = appUrl + '/api/' + currentPoll + '/candidates/';

const pollsApiUrl = appUrl + '/api/polls/';

//Go back to login screen
const logout = () => {
   window.location = appUrl;
}

//Go back to Polls page
const home = () => {
   window.location = appUrl + '/polls';
}

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
