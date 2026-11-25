(function(){
  var btn=document.querySelector('.menu'),nav=document.getElementById('nav');
  btn.addEventListener('click',function(){
    var open=nav.classList.toggle('open');
    btn.setAttribute('aria-expanded',open);
  });
  nav.addEventListener('click',function(e){
    if(e.target.tagName==='A'){nav.classList.remove('open');btn.setAttribute('aria-expanded','false');}
  });
  document.getElementById('yr').textContent=new Date().getFullYear();

  // Count-up for case study figures (final values are in the HTML, so it works without JS)
  var els=document.querySelectorAll('[data-count]');
  if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(!en.isIntersecting)return;
      io.unobserve(en.target);
      var el=en.target,end=parseFloat(el.dataset.count),fmt=el.dataset.format,t0=performance.now(),dur=1100;
      function show(v){
        el.textContent=fmt==='rs'?'Rs '+v.toFixed(2):Math.round(v).toLocaleString('en-US');
      }
      function tick(t){
        var p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,3);
        show(end*e);
        if(p<1)requestAnimationFrame(tick);else show(end);
      }
      requestAnimationFrame(tick);
    });
  },{threshold:.5});
  els.forEach(function(el){io.observe(el)});
})();

// Enquiry form: fires a Pixel "Lead" event for qualified budgets (Rs 30,000+), a custom "LowBudgetEnquiry" event otherwise, then opens WhatsApp with the answers pre-filled.
// No personal details are sent to the Pixel or stored by this site.
(function(){
  var form=document.getElementById('enquiry');
  if(!form)return;
  var NUMBER='923072061061';
  function track(name,params){try{if(window.fbq)fbq('track',name,params||{});}catch(e){}}
  function trackCustom(name,params){try{if(window.fbq)fbq('trackCustom',name,params||{});}catch(e){}}
  var QUALIFIED=['Rs 30,000 to 75,000','Rs 75,000 to 150,000','Over Rs 150,000'];
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var f=form.elements,bad=false;
    ['name','biz','type','where','budget'].forEach(function(k){
      var ok=f[k].value.trim()!=='';
      f[k].setAttribute('aria-invalid',ok?'false':'true');
      if(!ok)bad=true;
    });
    var err=document.getElementById('f-error');
    err.hidden=!bad;
    if(bad){form.querySelector('[aria-invalid="true"]').focus();return;}
    var text='Hi Huzaifa, I am '+f.name.value.trim()+' from '+f.biz.value.trim()+'.\n'+
      'I sell: '+f.type.value+'\n'+
      'Customers buy: '+f.where.value+'\n'+
      'Monthly ad budget: '+f.budget.value+
      (f.msg.value.trim()?'\n'+f.msg.value.trim():'');
    var url='https://wa.me/'+NUMBER+'?text='+encodeURIComponent(text);
    var link=document.getElementById('f-link');
    link.href=url;
    document.getElementById('f-fallback').hidden=false;
    var params={content_name:'Enquiry form',budget_range:f.budget.value,business_type:f.type.value,sales_channel:f.where.value};
    if(QUALIFIED.indexOf(f.budget.value)!==-1){track('Lead',params);}else{trackCustom('LowBudgetEnquiry',params);}
    setTimeout(function(){window.location.href=url;},400);
  });
  document.querySelectorAll('[data-track="contact"]').forEach(function(a){
    a.addEventListener('click',function(){track('Contact');});
  });
})();
