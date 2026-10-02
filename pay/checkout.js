(()=>{
  const status=document.getElementById('checkout-status');
  const cfg=window.RESULTARY_PADDLE_CONFIG;
  const fail=message=>{status.textContent=message;};
  if(!cfg||cfg.environment!=='sandbox'||typeof cfg.clientToken!=='string'||!cfg.clientToken.startsWith('test_')){
    fail('Checkout is not active yet. Resultary is finishing its Paddle sandbox configuration.');
    return;
  }
  if(!window.Paddle){
    fail('Secure checkout could not be loaded. Please refresh the page.');
    return;
  }
  try{
    Paddle.Environment.set('sandbox');
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
    // When this page is loaded with ?_ptxn=txn_..., Paddle.js opens
    // the server-created transaction automatically.
  }catch{
    fail('Secure checkout could not be initialized. Please return to Resultary and try again.');
  }
})();
