const config = window.DIDAKTIKA_CONFIG || {};
const emit = (name, details = {}) => window.dispatchEvent(new CustomEvent('didaktika:analytics', {detail:{event:name,...details}}));
const assessmentDialog = document.querySelector('#assessment-dialog');
document.querySelectorAll('[data-assessment]').forEach(link => {
  if (config.assessmentUrl) {
    const url = new URL(config.assessmentUrl, location.href);
    if (url.protocol === 'https:' || url.origin === location.origin) link.href = url.href;
  }
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.addEventListener('click', () => emit('assessment_click'));
});
document.querySelectorAll('.dialog-close').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom)dialog.close();}}));
document.querySelector('#assessment-waitlist').addEventListener('click',()=>assessmentDialog.close());
document.querySelector('#privacy-button').addEventListener('click',()=>document.querySelector('#privacy-dialog').showModal());
const activities=[
 '<p>BEFORE YOU READ</p><p class="question">When was the last time you took a break without looking at your phone?</p><p>Think of one thing that helps you switch off. What makes it work for you?</p>',
 '<p>WORDS IN CONTEXT</p><ul><li><strong>switch off</strong> — stop thinking about work</li><li><strong>recharge</strong> — regain your energy</li><li><strong>routine</strong> — something you do regularly</li></ul>',
 '<p>A DIFFERENT KIND OF BREAK</p><p>Every afternoon, Maya used to scroll through her phone between tasks. She rarely felt refreshed. One day, she left her phone at her desk and walked outside. It was a small change, but she noticed the sounds of the street and returned with a clearer head.</p>',
 '<p>TRUE OR FALSE?</p><p>Maya felt refreshed after scrolling through her phone.</p><div class="quiz-actions"><button class="button small outline" data-answer="false">True</button> <button class="button small outline" data-answer="true">False</button></div><p id="answer-feedback" role="status" style="margin-top:16px"></p>'
];
const tabs=[...document.querySelectorAll('[data-tab]')];
function selectTab(index){tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});const panel=document.querySelector('#activity');panel.setAttribute('aria-labelledby',`tab-${index}`);panel.innerHTML=activities[index];panel.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#answer-feedback').textContent=button.dataset.answer==='true'?'Correct. The text says she rarely felt refreshed.':'Try again. Look at how Maya felt before she changed her routine.';}));}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectTab(i));tab.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();selectTab(n);tabs[n].focus();});});selectTab(0);
const form = document.querySelector('#waitlist-form');
const status = document.querySelector('#form-status');
const nameInput = form.elements.namedItem('full_name');
const consentInput = form.elements.namedItem('consent');

if (config.registrationEnabled && config.waitlistWebhookUrl) {
  status.textContent = 'Registration is open. Submit the form to join the beta waitlist.';
}

let submissionId;
let submitting = false;

form.addEventListener('input', () => {
  submissionId = undefined;
  nameInput.setCustomValidity('');
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitting) return;

  nameInput.setCustomValidity(nameInput.value.trim() ? '' : 'Please enter your full name.');
  if (!form.reportValidity()) return;

  emit('waitlist_submit_attempt');
  if (!config.registrationEnabled || !config.waitlistWebhookUrl) {
    status.textContent = 'Registration is not open in this preview. Your information has not been sent or saved.';
    return;
  }

  const data = new FormData(form);
  if (data.get('website')) return;

  const button = form.querySelector('[type=submit]');
  submitting = true;
  button.disabled = true;
  form.setAttribute('aria-busy', 'true');
  status.textContent = 'Sending your registration…';

  try {
    submissionId ||= crypto.randomUUID();
    const payload = {
      full_name: String(data.get('full_name')).trim(),
      email: String(data.get('email')).trim(),
      role: data.get('role'),
      cefr_level: data.get('cefr_level'),
      level_source: ['unknown', 'below_a2'].includes(data.get('cefr_level'))
        ? 'unknown'
        : data.get('level_source'),
      consent: consentInput.checked,
      consent_text: 'I agree to receive emails about the Didaktika beta program. I can unsubscribe at any time.',
      consent_version: config.privacyVersion,
      submitted_at: new Date().toISOString(),
      submission_id: submissionId,
      source: 'didaktika-landing',
      utm: Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].map(key => [
        key, new URLSearchParams(location.search).get(key) || ''
      ]))
    };

    const response = await fetch(config.waitlistWebhookUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw Error('request_failed');

    const result = await response.json();
    if (result?.success !== true) throw Error('not_accepted');

    status.textContent = 'You’re on the waitlist. Thank you for helping shape Didaktika.';
    emit('waitlist_success');
    form.reset();
    submissionId = undefined;
  } catch {
    status.textContent = 'We could not confirm your registration. Please try again. Your previous attempt may have reached us.';
    emit('waitlist_error');
  } finally {
    submitting = false;
    button.disabled = false;
    form.setAttribute('aria-busy', 'false');
  }
});
document.querySelector('#year').textContent=new Date().getFullYear();
emit('landing_view');
