import { useEffect, useState } from 'react';



const sdk = window.JSSDK;



const useSdkNavigationHref = () => {
    const [href, setHref] = useState<string | undefined>();
    useEffect(() => {
        (async () => {
            try {
                const navhref = await sdk.navigation.getHref();
                setHref(navhref);
            } catch (e) {
                console.error('Failed to load SDK context:', e);
            }
        })();
    }, []);

    return href;
};

export default useSdkNavigationHref;