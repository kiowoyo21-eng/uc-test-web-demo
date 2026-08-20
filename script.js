const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const menu=$('.menu'),links=$('.links'); if(menu) menu.onclick=()=>links.classList.toggle('open');
$$('.links a').forEach(a=>a.onclick=()=>links.classList.remove('open'));
const reveal=()=>$$('[data-reveal]').forEach(x=>{if(x.getBoundingClientRect().top<innerHeight*.88)x.classList.add('seen')}); addEventListener('scroll',reveal,{passive:true});reveal();

const motionBlocks=$$('.service-intro,.service-billboard');
if(motionBlocks.length){
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting)e.target.classList.add('in-view');
 }),{threshold:.18});
 motionBlocks.forEach(x=>observer.observe(x));
 let ticking=false;
 const serviceMotion=()=>{ticking=false;motionBlocks.forEach(block=>{
  const r=block.getBoundingClientRect(),p=Math.max(-1,Math.min(1,(innerHeight/2-(r.top+r.height/2))/innerHeight));
  block.style.setProperty('--scroll',p.toFixed(3));
 })};
 addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(serviceMotion);ticking=true}},{passive:true});serviceMotion();
}

if($('#booking')){
 let step=0, branch='', selectedDate='', view=new Date(); view.setDate(1);
 const steps=$$('.booking-step'), bar=$('.progress i'), next=$('#next'), back=$('#back'), error=$('#error');
 const show=n=>{step=n;steps.forEach((x,i)=>x.classList.toggle('active',i===n));bar.style.width=((n+1)/4*100)+'%';back.classList.toggle('hidden',n===0||n===3);next.classList.toggle('hidden',n===3);next.textContent=n===2?'CONFIRM BOOKING':'CONTINUE →';error.textContent='';scrollTo({top:0,behavior:'smooth'})};
 $$('.branch-choice').forEach(b=>b.onclick=()=>{$$('.branch-choice').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');branch=b.dataset.branch});
 function calendar(){
  const box=$('#calendar'),title=$('#monthTitle');box.innerHTML='';title.textContent=view.toLocaleString('en',{month:'long',year:'numeric'});
  ['SUN','MON','TUE','WED','THU','FRI','SAT'].forEach(d=>box.insertAdjacentHTML('beforeend',`<span>${d}</span>`));
  for(let i=0;i<view.getDay();i++)box.append(document.createElement('i'));
  const days=new Date(view.getFullYear(),view.getMonth()+1,0).getDate(),today=new Date();today.setHours(0,0,0,0);
  for(let d=1;d<=days;d++){const dt=new Date(view.getFullYear(),view.getMonth(),d),btn=document.createElement('button');btn.className='day';btn.textContent=d;btn.disabled=dt<today;btn.onclick=()=>{$$('.day').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected');selectedDate=dt.toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'})};box.append(btn)}
 }
 $('#prevMonth').onclick=()=>{view.setMonth(view.getMonth()-1);calendar()};$('#nextMonth').onclick=()=>{view.setMonth(view.getMonth()+1);calendar()};calendar();
 const params=new URLSearchParams(location.search),requested=params.get('service'),requestedBranch=params.get('branch');if(requested){const select=$('#service');[...select.options].forEach(o=>{if(o.textContent.includes(requested)||requested.includes(o.textContent))select.value=o.value})}if(requestedBranch){const target=$$('.branch-choice').find(b=>b.dataset.branch===requestedBranch);if(target)target.click()}
 next.onclick=()=>{if(step===0&&!branch)return error.textContent='Please select a branch.';if(step===1&&!selectedDate)return error.textContent='Please select an available date.';if(step===2){const required=['name','car','contact','email','service','concern'];if(required.some(id=>!$('#'+id).value.trim()))return error.textContent='Please complete all booking details.';$('#summary').innerHTML=`<strong>${$('#name').value}</strong><p>${$('#car').value}<br>${$('#service').value}<br>${branch} · ${selectedDate}</p><p>We received your demo booking request. Final database submission will be connected next.</p>`}show(step+1)};
 back.onclick=()=>show(step-1);
}
