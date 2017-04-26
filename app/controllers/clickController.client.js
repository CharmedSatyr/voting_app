'use strict';

(() => {
   const addButton = document.querySelector('.btn-add');
   const deleteButton = document.querySelector('.btn-delete');
   const clickNbr = document.querySelector('#click-nbr');
   const apiUrl = appUrl + '/api/:id/clicks';

   const updateClickCount = (data) => {
      const clicksObject = JSON.parse(data);
      clickNbr.innerHTML = clicksObject.clicks;
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount));


   addButton.addEventListener('click', () => {
      ajaxFunctions.ajaxRequest('POST', apiUrl, () => {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount)
      });

   }, false);

   deleteButton.addEventListener('click', () => {
      ajaxFunctions.ajaxRequest('DELETE', apiUrl, () => {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);

})();
