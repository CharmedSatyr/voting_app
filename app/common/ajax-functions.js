const appUrl = window.location.origin;

const ready = (fn) => {
   if (typeof fn !== 'function') {
      return;
   }

   if (document.readyState === 'complete') {
      return fn();
   }

   document.addEventListener('DOMContentLoaded', fn, false);
}

const ajaxRequest = (method, url, callback) => {
   const xmlhttp = new XMLHttpRequest();

   xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
         callback(xmlhttp.response);
      }
   };

   xmlhttp.open(method, url, true);
   xmlhttp.send();
};

const ajaxFunctions = {
   ready: ready,
   ajaxRequest: ajaxRequest
};
