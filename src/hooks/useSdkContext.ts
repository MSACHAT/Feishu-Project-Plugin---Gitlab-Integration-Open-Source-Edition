import { Context } from '@lark-project/js-sdk';
import { useEffect, useState } from 'react';



const sdk = window.JSSDK;



const useSdkContext = () => {
  const [context, setContext] = useState<Context | undefined>();
  useEffect(() => {
    let unwatch: (() => void) | undefined;
    (async () => {
      try {

        const ctx = await sdk.Context.load();
        setContext(ctx);
        unwatch = ctx.watch(nextCtx => {
          setContext(nextCtx);
        });
      } catch (e) {
        console.error('Failed to load SDK context:', e);
      }
    })();
    return () => {
      unwatch?.();
    };
  }, []);

  return context;
};

export default useSdkContext;