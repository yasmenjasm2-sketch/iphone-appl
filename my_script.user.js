// ==UserScript==
// @name         NBK/Senpa Ultimate FPS Optimizer & Menu + Auto Tab (Remas Edition)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Smart FPS control system with a professional collapsible interface (Remas Logo)
// @author       Tek & Gemini
// @match        https://nbk.io/*
// @match        https://senpa.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // --- Original FPS Variables ---
    let targetFPS = parseInt(localStorage.getItem('tek_fps_cap')) || 90;
    let frameDelay = 1000 / targetFPS;
    let lastFrameTime = 0;

    // --- Auto Tab Variables ---
    let tabInterval = null;
    let isTabRunning = false;

    // --- Smart Frame Stabilization Engine ---
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
        return originalRAF(function(timestamp) {
            if (targetFPS === 0) {
                callback(timestamp);
                return;
            }
            const elapsed = timestamp - lastFrameTime;
            if (elapsed < (frameDelay - 0.1)) {
                window.requestAnimationFrame(callback);
                return;
            }
            lastFrameTime = timestamp - (elapsed % frameDelay);
            callback(timestamp);
        });
    };

    // --- Tab Key Simulation Function ---
    function simulateTabPress() {
        const eventConfig = {
            key: "Tab", keyCode: 9, code: "Tab", which: 9,
            bubbles: true, cancelable: true
        };
        const keyDown = new KeyboardEvent("keydown", eventConfig);
        const keyUp = new KeyboardEvent("keyup", eventConfig);
        document.dispatchEvent(keyDown);
        document.dispatchEvent(keyUp);
    }

    // --- Performance Tweaks ---
    function applyPerformanceTweaks() {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.style.transform = 'translateZ(0)';
            canvas.style.willChange = 'transform';
        }
    }

    // --- UI Menu Creation ---
    function createMenu() {
        // Main Container
        const container = document.createElement('div');
        container.id = 'remas-main-container';
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '10000',
            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
        });

        // Remas Logo (Toggle Button)
        const logo = document.createElement('div');
        logo.innerHTML = 'Remas';
        Object.assign(logo.style, {
            width: '60px',
            height: '60px',
            backgroundColor: '#CFCA3C',
            color: 'black',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            border: '2px solid #fff',
            transition: 'transform 0.3s ease',
            userSelect: 'none'
        });

        // Menu Body
        const menuBody = document.createElement('div');
        menuBody.id = 'remas-menu-body';
        Object.assign(menuBody.style, {
            backgroundColor: 'rgba(15, 15, 15, 0.95)',
            border: '1px solid #CFCA3C',
            borderRadius: '12px',
            padding: '15px',
            marginBottom: '10px',
            width: '160px',
            display: 'none',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.8)',
            textAlign: 'center'
        });

        menuBody.innerHTML = `
            <div style="color: #CFCA3C; font-weight: bold; font-size: 13px; border-bottom: 1px solid #333; padding-bottom: 5px;">FPS CONTROL</div>
            <select id="fps-select" style="background: #252525; color: white; border: 1px solid #444; padding: 5px; cursor: pointer; border-radius: 5px;">
                <option value="60" ${targetFPS === 60 ? 'selected' : ''}>60 FPS</option>
                <option value="90" ${targetFPS === 90 ? 'selected' : ''}>90 FPS</option>
                <option value="120" ${targetFPS === 120 ? 'selected' : ''}>120 FPS</option>
                <option value="0" ${targetFPS === 0 ? 'selected' : ''}>Unlimited</option>
            </select>

            <div style="color: #CFCA3C; font-weight: bold; font-size: 13px; border-bottom: 1px solid #333; padding-bottom: 5px; margin-top: 5px;">AUTO TAB</div>
            <div style="display: flex; align-items: center; justify-content: center; gap: 5px;">
                <input type="number" id="tab-ms" value="100" step="10" min="10" style="width: 50px; background: #252525; color: white; border: 1px solid #444; text-align: center; border-radius: 4px; font-size: 12px;">
                <span style="font-size: 10px; color: #ccc;">ms</span>
            </div>
            <button id="tab-toggle-btn" style="width: 100%; padding: 8px; cursor: pointer; background: #333; color: white; border: 1px solid #CFCA3C; border-radius: 6px; font-weight: bold; transition: 0.2s;">START TAB</button>
            <div id="ping-status" style="font-size: 10px; color: #777;">System Active</div>
        `;

        container.appendChild(menuBody);
        container.appendChild(logo);
        document.body.appendChild(container);

        // --- Toggle Functionality ---
        let isOpen = false;
        logo.addEventListener('click', () => {
            isOpen = !isOpen;
            if (isOpen) {
                menuBody.style.display = 'flex';
                logo.style.transform = 'scale(0.9) rotate(360deg)';
                logo.style.backgroundColor = '#fff';
                logo.style.color = '#CFCA3C';
            } else {
                menuBody.style.display = 'none';
                logo.style.transform = 'scale(1) rotate(0deg)';
                logo.style.backgroundColor = '#CFCA3C';
                logo.style.color = 'black';
            }
        });

        // --- Event Listeners ---

        // FPS Selection
        document.getElementById('fps-select').addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            targetFPS = val;
            frameDelay = 1000 / val;
            localStorage.setItem('tek_fps_cap', val);
        });

        // Auto Tab Toggle
        const tabBtn = document.getElementById('tab-toggle-btn');
        const tabInput = document.getElementById('tab-ms');

        tabBtn.addEventListener('click', () => {
            if (!isTabRunning) {
                const ms = parseInt(tabInput.value) || 100;
                isTabRunning = true;
                tabBtn.innerText = 'STOP TAB';
                tabBtn.style.backgroundColor = '#CFCA3C';
                tabBtn.style.color = 'black';
                tabInterval = setInterval(simulateTabPress, ms);
            } else {
                isTabRunning = false;
                tabBtn.innerText = 'START TAB';
                tabBtn.style.backgroundColor = '#333';
                tabBtn.style.color = 'white';
                clearInterval(tabInterval);
            }
        });
    }

    // --- Script Initialization ---
    window.addEventListener('load', () => {
        createMenu();
        setInterval(applyPerformanceTweaks, 2000);
    });

    setInterval(() => {
        if (!document.hidden) window.dispatchEvent(new Event('resize'));
    }, 5000);

})();