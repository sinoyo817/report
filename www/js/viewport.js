if (navigator.platform == "iPad" || (navigator.platform == "MacIntel" && navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf("Chrome") == -1 && navigator.standalone !== undefined) || (navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') == -1)) {
    document.head.insertAdjacentHTML('beforeend', '<meta name="viewport" content="width=1360">');
} else {
    function switchViewport() {
        if (window.outerWidth < 375) {
            document.head.insertAdjacentHTML('beforeend', '<meta name="viewport" content="width=375">');
        } else {
            document.head.insertAdjacentHTML('beforeend', '<meta name="viewport" content="width=device-width,initial-scale=1">');
        }
    }
    function switchViewportResize() {
        if (window.outerWidth < 375) {
            document.querySelector('meta[name="viewport"]').setAttribute("content", "width=375");
        } else {
            document.querySelector('meta[name="viewport"]').setAttribute("content", "width=device-width,initial-scale=1");
        }
    }
    addEventListener('resize', switchViewportResize, false);
    switchViewport();
}