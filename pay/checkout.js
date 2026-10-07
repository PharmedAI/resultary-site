(()=>{
  const status=document.getElementById('checkout-status');
  const cfg=window.RESULTARY_PADDLE_CONFIG;
  const fail=message=>{status.textContent=message;};
  if(!cfg||!['sandbox','production'].includes(cfg.environment)||typeof cfg.clientToken!=='string'||
     (cfg.environment==='sandbox'&&!cfg.clientToken.startsWith('test_'))||
     (cfg.environment==='production'&&!cfg.clientToken.startsWith('live_'))){
    fail('Checkout is not active yet. Resultary is finishing its Paddle configuration.');
    return;
  }
  if(!window.Paddle){
    fail('Secure checkout could not be loaded. Please refresh the page.');
    return;
  }

  const transactionId=new URLSearchParams(window.location.search).get('_ptxn');
  if(!/^txn_[a-z0-9]{26}$/.test(transactionId||'')){
    fail('This checkout link is invalid or expired. Please return to Resultary and start again.');
    return;
  }

  try{
    if(cfg.environment==='sandbox')Paddle.Environment.set('sandbox');
    Paddle.Initialize({
      token:cfg.clientToken,
      checkout:{
        settings:{
          displayMode:'overlay',
          theme:'light',
          locale:'en',
          successUrl:cfg.successUrl
        }
      },
      eventCallback:event=>{
        if(event?.name==='checkout.completed'){
          status.textContent='Trial started successfully. Redirecting to Resultary…';
        }else if(event?.name==='checkout.closed'){
          status.textContent='Checkout closed. You can reopen it from Resultary when you are ready.';
        }
      }
    });

    status.textContent='Secure Paddle checkout is opening…';
    Paddle.Checkout.open({transactionId});
  }catch{
    fail('Secure checkout could not be initialized. Please return to Resultary and try again.');
  }
})();