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
        <div id="counterScreen" style="display:flex;justify-content:center;align-items:center;height:100vh;background:#fff;">
            <span id="repCount" style="font-size:10rem;">${reps}</span>
        </div>
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

        recognition.onresult = function(event) {
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    const transcript = event.results[i][0].transcript.trim().toLowerCase();
                    if (transcript.includes('up')) {
                        currentCount++;
                        repCountEl.textContent = currentCount;
                    } else if (transcript.includes('down')) {
                        currentCount = Math.max(0, currentCount - 1);
                        repCountEl.textContent = currentCount;
                    }
                }
            }
        };

        recognition.start();
    } else {
        alert('Speech recognition not supported in this browser.');
    }
});