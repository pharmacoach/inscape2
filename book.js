/* =========================================================
   Inscape — shared booking / lead-capture block
   Fills any <div class="book__grid" data-book-grid> with the
   "what happens" rail + capture form, and wires the form to
   compose a personal email to hello@inscape.co.
   To use a live scheduler (Calendly / SavvyCal / HubSpot),
   replace the .book__card form with the embed.
   ========================================================= */
(function(){
  var EMAIL = 'hello@inscape.co';
  // Web3Forms access key (see form-backend/SETUP.md). Empty = falls back to opening an email.
  var ACCESS_KEY = 'd419b361-0d82-45f3-8ddd-1e85d5fb17d4';
  var ENDPOINT = 'https://api.web3forms.com/submit';
  // Make.com custom-webhook URL that creates the Monday CRM item (see form-backend/MONDAY.md). Empty = skipped.
  var MONDAY_HOOK = '';
  var RAIL_INNER =
    '<h3 class="book__railhd">What happens on the call</h3>'
    + '<ol class="book__steps">'
    + '<li><span class="bn">01</span><div><h4>Fifteen focused minutes</h4><p>No slides, no script. We listen to where your team is, and what\u2019s getting in the way of it performing.</p></div></li>'
    + '<li><span class="bn">02</span><div><h4>One useful insight</h4><p>You leave with at least one read on your team you didn\u2019t walk in with, whether we go on to work together or not.</p></div></li>'
    + '<li><span class="bn">03</span><div><h4>A clear next step</h4><p>If there\u2019s a fit, we outline what an engagement could look like. If there isn\u2019t, we\u2019ll tell you that plainly.</p></div></li>'
    + '</ol>'
    + '<div class="book__direct">'
    + '<span class="book__directk">Prefer email?</span>'
    + '<a class="book__email" href="mailto:' + EMAIL + '?subject=Consultation%20enquiry">' + EMAIL + '</a>'
    + '<p class="book__resp">A senior member of the team replies personally, within one business day.</p>'
    + '</div>'
    + '<div class="book__assure"><span class="dot"></span> Confidential \u00b7 Senior-led \u00b7 No obligation</div>';

  var CARD_INNER =
    '<form class="book__form" data-book-form novalidate>'
    + '<div class="bf__row">'
    + '<label>First name<input name="first" type="text" autocomplete="given-name" required placeholder="Jane"></label>'
    + '<label>Last name<input name="last" type="text" autocomplete="family-name" required placeholder="Doe"></label>'
    + '</div>'
    + '<div class="bf__row">'
    + '<label>Work email<input name="email" type="email" autocomplete="email" required placeholder="you@company.com"></label>'
    + '<label>Your situation<select name="situation" required><option value="">— Select —</option><option>Post-restructure alignment</option><option>Launch readiness</option><option>Underperformance diagnosis</option><option>Stakeholder complexity</option><option>Retention crisis</option><option>Crossfunctional initiative</option><option>Regional/subsidiary integration</option><option>New to role</option><option>Competitive pressure</option><option>Scale without chaos</option><option>New team</option><option>Leadership journey for new team</option><option>Upskilling my leadership team</option><option>Other (describe below)</option></select></label>'
    + '</div>'
    + '<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">'
    + '<label>Your message<textarea name="msg" rows="3" placeholder="Let\'s find a time to talk. My EA\'s email is..."></textarea></label>'
    + '<button class="btn btn-primary btn-lg" type="submit">Express interest <span class="arr">\u2192</span></button>'
    + '</form>'
    + '<div class="book__success" data-book-success hidden>'
    + '<h3 style="font-size:clamp(28px,3vw,42px);max-width:22ch;">Thank you. Your request has been received.</h3>'
    + '</div>';

  var GRID =
    '<aside class="book__rail reveal d2">' + RAIL_INNER + '</aside>'
    + '<div class="book__card reveal d2">' + CARD_INNER + '</div>';

  function wire(form){
    var card = form.closest('.book__card');
    var success = card ? card.querySelector('[data-book-success]') : null;
    var btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!form.reportValidity()) return;
      var d = new FormData(form);
      var g = function(k){ return (d.get(k) || '').toString().trim(); };
      if(g('website')) return; // spam trap
      var done = function(){ form.hidden = true; if(success) success.hidden = false; };
      var mailto = function(){
        var subject = 'Consultation request \u2014 ' + ((g('first') + ' ' + g('last')).trim() || 'pharma leader');
        var body = 'Name: ' + g('first') + ' ' + g('last') + '\n' + 'Work email: ' + g('email') + '\n' + 'Situation: ' + g('situation') + '\n\n' + (g('msg') || '(no message)') + '\n';
        var a = document.createElement('a');
        a.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        a.click(); done();
      };
      if(!ACCESS_KEY){ mailto(); return; }
      var full = (g('first') + ' ' + g('last')).trim();
      var rec = { firstName:g('first'), lastName:g('last'), email:g('email'), situation:g('situation'), message:g('msg'), page:document.title + ' \u2014 ' + location.pathname, received:new Date().toISOString() };
      var fd = new FormData();
      fd.append('access_key', ACCESS_KEY);
      fd.append('subject', 'New consultation request \u2014 ' + (full || 'website'));
      fd.append('from_name', 'Inscape website');
      fd.append('replyto', g('email'));
      fd.append('First name', g('first'));
      fd.append('Last name', g('last'));
      fd.append('Work email', g('email'));
      fd.append('Situation', g('situation'));
      fd.append('Message', g('msg') || '(none)');
      fd.append('Page', rec.page);
      fd.append('Record', '##START##' + JSON.stringify(rec) + '##END##');
      if(btn){ btn.disabled = true; btn.firstChild.textContent = 'Sending\u2026 '; }
      if(MONDAY_HOOK){
        var mf = new FormData();
        for(var key in rec){ mf.append(key, rec[key]); }
        try{ fetch(MONDAY_HOOK, { method:'POST', mode:'no-cors', body: mf, keepalive:true }); }catch(err){}
      }
      fetch(ENDPOINT, { method:'POST', body: fd })
        .then(function(r){ return r.json(); })
        .then(function(j){ if(!j || !j.success) throw new Error('send failed'); done(); })
        .catch(function(){ if(btn){ btn.disabled = false; btn.firstChild.textContent = 'Express interest '; } mailto(); });
    });
  }

  function init(){
    var grids = document.querySelectorAll('[data-book-grid]');
    for(var i=0;i<grids.length;i++){
      grids[i].innerHTML = GRID;
    }
    // split layout: rail and card placed separately on the page
    var rails = document.querySelectorAll('[data-book-rail]');
    for(var r=0;r<rails.length;r++){
      rails[r].classList.add('book__rail');
      rails[r].innerHTML = RAIL_INNER;
    }
    var cards = document.querySelectorAll('[data-book-card]');
    for(var c=0;c<cards.length;c++){
      cards[c].classList.add('book__card');
      cards[c].innerHTML = CARD_INNER;
    }
    var forms = document.querySelectorAll('[data-book-form]');
    for(var j=0;j<forms.length;j++){
      wire(forms[j]);
    }
    // injected blocks miss the page's reveal observer — reveal them ourselves
    var injected = document.querySelectorAll('[data-book-grid] .reveal:not(.in)');
    if('IntersectionObserver' in window){
      var bio = new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');bio.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.05});
      for(var k=0;k<injected.length;k++) bio.observe(injected[k]);
    } else { for(var k2=0;k2<injected.length;k2++) injected[k2].classList.add('in'); }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
