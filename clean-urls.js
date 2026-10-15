/* Inscape: clean URLs on the live site only.
   Source links keep ".html" so pages stay clickable in the design preview;
   on inscape.co this hides ".html" from the address bar and from links. */
(function(){
  if(!/(^|\.)inscape\.co$/i.test(location.hostname)) return;
  var p = location.pathname;
  var clean = p.replace(/\/index\.html$/i,'/').replace(/\.html$/i,'');
  if(clean !== p) history.replaceState(null,'',clean + location.search + location.hash);
  function tidy(){
    var as = document.querySelectorAll('a[href]');
    for(var i=0;i<as.length;i++){
      var h = as[i].getAttribute('href');
      if(/^(https?:|mailto:|tel:|#|\/\/)/i.test(h)) continue;
      var n = h.replace(/^(\.\/)?index\.html(?=#|\?|$)/i,'/').replace(/\.html(?=#|\?|$)/i,'');
      if(n === '') n = '/';
      if(n !== h) as[i].setAttribute('href', n);
    }
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tidy); else tidy();
})();
