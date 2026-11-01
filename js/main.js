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
