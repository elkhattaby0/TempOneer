document.addEventListener("DOMContentLoaded", () => {
    const days = document.getElementById('days');
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const clearBtn = document.getElementById('clearBtn');

    function pad(n) { return n.toString().padStart(2, '0'); }

    function updateDisplay(counter) {
        if (!counter) {
            console.warn('Counter is undefined');
            return;
        }
        days.textContent = pad(counter.dd || 0);
        hours.textContent = pad(counter.hh || 0);
        minutes.textContent = pad(counter.mm || 0);
        seconds.textContent = pad(counter.ss || 0);
    }

    chrome.runtime.sendMessage({ action: 'get' }, updateDisplay);

    startBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'start' });
    });

    stopBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'stop' });
    });

    clearBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'clear' });
        updateDisplay({ dd: 0, hh: 0, mm: 0, ss: 0 });
    });

    setInterval(() => {
        chrome.runtime.sendMessage({ action: 'get' }, updateDisplay);
    }, 1000);
});
