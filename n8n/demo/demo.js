'use strict';
(() => {
  const data={
    pending:{
      badge:'Pending verification',external:'Not checked yet',
      detail:'The run was reported, but a successful n8n execution alone is not business proof. Resultary waits for separately authorized destination evidence.',
    },
    missing:{
      badge:'Business result missing',external:'Not found',
      detail:'In this fictional example, the independently queried destination did not contain the expected record after the allowed confirmation period. This is an example of a verified missing outcome, not merely a missing run signal.',
    },
    recovered:{
      badge:'Business result recovered',external:'Record confirmed',
      detail:'In this fictional example, an independent destination read later finds the expected record. Resultary can record recovery after the previous confirmed incident.',
    },
  };
  const buttons=[...document.querySelectorAll('button[data-scenario]')];
  for(const button of buttons){
    button.addEventListener('click',()=>{
      const state=data[button.dataset.scenario];
      if(!state)return;
      document.getElementById('state-badge').textContent=state.badge;
      document.getElementById('external-result').textContent=state.external;
      document.getElementById('state-explanation').textContent=state.detail;
      for(const candidate of buttons){
        candidate.setAttribute('aria-pressed',String(candidate===button));
      }
    });
  }
})();
