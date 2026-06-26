/* =========================================================
   Inscape — shared booking / lead-capture block
   Fills any <div class="book__grid" data-book-grid> with the
   "what happens" rail + capture form, and wires the form to
   compose a personal email to Hello@inscape.co.
   To use a live scheduler (Calendly / SavvyCal / HubSpot),
   replace the .book__card form with the embed.
   ========================================================= */
(function(){
  var EMAIL = 'Hello@inscape.co';
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
    + '<label>Full name<input name="name" type="text" autocomplete="name" required placeholder="Jane Doe"></label>'
    + '<label>Work email<input name="email" type="email" autocomplete="email" required placeholder="you@company.com"></label>'
    + '</div>'
    + '<div class="bf__row">'
    + '<label>Your situation<select name="situation" required><option value="">— Select —</option><option>Post-restructure alignment</option><option>Launch readiness</option><option>Underperformance diagnosis</option><option>Stakeholder complexity</option><option>Retention crisis</option><option>Crossfunctional initiative</option><option>Regional/subsidiary integration</option><option>New to role</option><option>Competitive pressure</option><option>Scale without chaos</option><option>New team</option><option>Leadership journey for new team</option><option>Upskilling my leadership team</option><option>Other (describe below)</option></select></label>'
    + '</div>'
    + '<label>Your message<textarea name="msg" rows="3" placeholder="Let\'s find a time to talk. My EA\'s email is..."></textarea></label>'
    + '<button class="btn btn-primary btn-lg" type="submit">Express interest <span class="arr">\u2192</span></button>'
    + '<p class="bf__micro">A senior member of the team will reach out within one business day. Your details stay confidential and are never shared.</p>'
    + '</form>'
    + '<div class="book__success" data-book-success hidden>'
    + '<h3 style="font-size:clamp(28px,3vw,42px);max-width:32ch;">Once your request is on its way. We\'ll be in touch within one business day.</h3>'
    + '<a class="btn btn-primary btn-lg" href="mailto:' + EMAIL + '?subject=Strategic%20consultation" style="margin-top:24px;">Book a strategic consultation <span class="arr">→</span></a>'
    + '</div>';

  var GRID =
    '<aside class="book__rail reveal d2">' + RAIL_INNER + '</aside>'
    + '<div class="book__card reveal d2">' + CARD_INNER + '</div>';

  function wire(form){
    var card = form.closest('.book__card');
    var success = card ? card.querySelector('[data-book-success]') : null;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!form.reportValidity()) return;
      var d = new FormData(form);
      var g = function(k){ return (d.get(k) || '').toString().trim(); };
      var subject = 'Consultation request \u2014 ' + (g('name') || 'pharma leader');
      var body =
        'Name: ' + g('name') + '\n' +
        'Work email: ' + g('email') + '\n' +
        'Company: ' + g('company') + '\n' +
        'Role: ' + g('role') + '\n\n' +
        (g('msg') || '(no message)') + '\n';
      window.setTimeout(function(){
        var a = document.createElement('a');
        a.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        a.click();
      }, 50);
      form.hidden = true;
      if(success) success.hidden = false;
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
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
