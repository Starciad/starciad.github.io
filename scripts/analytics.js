let _gaq = _gaq || [];

function loadTracking() {
    window._gaq.push(['_setAccount', 'G-75VKPPREV5']);
    window._gaq.push(['_trackPageview']);

    (function () {
        let ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        let s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
}

loadTracking();