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