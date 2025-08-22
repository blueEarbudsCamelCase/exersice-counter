const startReps = document.getElementById('startReps');

startReps.addEventListener('submit', function(event) {
    event.preventDefault();
    const repsInput = document.getElementById('reps');
    const reps = parseInt(repsInput.value, 10);
    if (isNaN(reps) || reps <= 0) {
        alert('Please enter a valid number of reps.');
        return;
    }

    // Remove form and show blank screen with large number
    document.body.innerHTML = `
        <main id="counterScreen">
            <span id="repCount">${reps}</span>
        </main>
    `;

    let currentCount = reps;
    const repCountEl = document.getElementById('repCount');

    // Simple beep sound using Web Audio API
    function playBeep(frequency = 440, duration = 120, type = 'sine') {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        gain.gain.value = 0.2;
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
            ctx.close();
        }, duration);
    }

    // Voice recognition setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            console.log('Speech recognition started');
        };

        recognition.onresult = function(event) {
            console.log('Speech recognition result received');
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    const transcript = event.results[i][0].transcript.trim().toLowerCase();
                    console.log('Transcript:', transcript);
                    if (transcript.includes('next')) {
                        currentCount = Math.max(0, currentCount - 1);
                        repCountEl.textContent = currentCount;
                        console.log('Count decremented:', currentCount);
                        playBeep(440, 120, 'sine'); // Beep for each decrement
                        if (currentCount === 0) {
                            playBeep(880, 400, 'triangle'); // Different beep at end
                        }
                    }
                }
            }
        };

        recognition.onerror = function(event) {
            console.log('Speech recognition error:', event.error);
        };

        recognition.onend = function() {
            console.log('Speech recognition ended');
            if (currentCount > 0) {
                console.log('Restarting recognition');
                recognition.start();
            } else {
                console.log('Recognition stopped, count is 0');
            }
        };

        recognition.start();
    } else {
        alert('Speech recognition not supported in this browser.');
    }
});