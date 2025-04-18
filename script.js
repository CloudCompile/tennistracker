document.addEventListener('DOMContentLoaded', function() {
    const matchForm = document.getElementById('matchForm');
    const practiceForm = document.getElementById('practiceForm');
    const matchesList = document.getElementById('matches');
    const practicesList = document.getElementById('practices');

    let matches = [];
    let practices = [];

    // Load data from localStorage if available
    if (localStorage.getItem('matches')) {
        matches = JSON.parse(localStorage.getItem('matches'));
        renderMatches();
    }

    if (localStorage.getItem('practices')) {
        practices = JSON.parse(localStorage.getItem('practices'));
        renderPractices();
    }

    matchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const matchType = document.getElementById('matchType').value;
        const servesIn = document.getElementById('servesIn').value;
        const servesOut = document.getElementById('servesOut').value;
        const setScores = document.getElementById('setScores').value;
        const gameScores = document.getElementById('gameScores').value;

        const match = { matchType, servesIn, servesOut, setScores, gameScores };
        matches.push(match);
        localStorage.setItem('matches', JSON.stringify(matches));
        renderMatches();
        matchForm.reset();
    });

    practiceForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const timeSpent = document.getElementById('timeSpent').value;
        const effort = document.getElementById('effort').value;
        const workOn = document.getElementById('workOn').value;

        const practice = { timeSpent, effort, workOn };
        practices.push(practice);
        localStorage.setItem('practices', JSON.stringify(practices));
        renderPractices();
        practiceForm.reset();
    });

    function renderMatches() {
        matchesList.innerHTML = '';
        matches.forEach((match, index) => {
            const li = document.createElement('li');
            li.textContent = `Match ${index + 1}: ${match.matchType} | Serves In: ${match.servesIn} | Serves Out: ${match.servesOut} | Sets: ${match.setScores} | Games: ${match.gameScores}`;
            matchesList.appendChild(li);
        });
    }

    function renderPractices() {
        practicesList.innerHTML = '';
        practices.forEach((practice, index) => {
            const li = document.createElement('li');
            li.textContent = `Practice ${index + 1}: ${practice.timeSpent} minutes | Effort: ${practice.effort}% | Worked On: ${practice.workOn}`;
            practicesList.appendChild(li);
        });
    }
});
