chrome.action.setBadgeText({text: 'OFF'});
chrome.action.setBadgeBackgroundColor({color: '#F44336'});

let ss = 0, mm = 0, hh = 0, dd = 0;
let intervalId = null;

chrome.storage.local.get(['counter'], data => {
    if (data && data.counter) {
        dd = data.counter.dd || 0;
        hh = data.counter.hh || 0;
        mm = data.counter.mm || 0;
        ss = data.counter.ss || 0;
    }
});

function updateCounter() {
    ss++;
    if(ss === 60){ ss=0; mm++; }
    if(mm === 60){ mm=0; hh++; }
    if(hh === 24){ hh=0; dd++; }
    chrome.storage.local.set({counter: {dd, hh, mm, ss}});
}

function updateBadge(counting) {
    if(counting) {
        chrome.action.setBadgeText({text: 'RUN'});
        chrome.action.setBadgeBackgroundColor({color: '#4CAF50'});
    } else {
        chrome.action.setBadgeText({text: 'OFF'});
        chrome.action.setBadgeBackgroundColor({color: '#F44336'});
    }
}
function notify(msg) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "assets/img/icon.png",
        title: "Timer Status",
        message: msg
    });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'start') {
        if (intervalId) return;
        intervalId = setInterval(updateCounter,1000);
        updateBadge(true);
        notify("Counter is running");
    } else if (msg.action === 'stop') {
        clearInterval(intervalId);
        intervalId = null;
        updateBadge(false);
        notify("Counter stopped");
    } else if (msg.action === 'clear') {
        ss=0; mm=0; hh=0; dd=0;
        chrome.storage.local.set({counter:{dd, hh, mm, ss}});
        notify("Counter cleared");
    } else if (msg.action === 'get') {
        chrome.storage.local.get(['counter'], data => {
            if (data && data.counter) {
                sendResponse(data.counter);
            } else {
                sendResponse({dd, hh, mm, ss});
            }
        });
        return true; 
    }
});
