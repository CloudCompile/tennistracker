document.addEventListener('DOMContentLoaded', function() {
    const matchForm = document.getElementById('matchForm');
    const practiceForm = document.getElementById('practiceForm');
    const matchesList = document.getElementById('matches');
    const practicesList = document.getElementById('practices');

    let matches = [];
    let practices = [];

    matchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const matchType = document.getElementById('matchType').value;
        const setScores = document.getElementById('setScores').value;
        const gameScores = document.getElementById('gameScores').value;

        const match = { matchType, setScores, gameScores };
        matches.push(match);
        renderMatches();
        matchForm.reset();
    });

    practiceForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const timeSpent = document.getElementById('timeSpent').value;

        const practice = { timeSpent };
        practices.push(practice);
        renderPractices();
        practiceForm.reset();
    });

    function renderMatches() {
        matchesList.innerHTML = '';
        matches.forEach((match, index) => {
            const li = document.createElement('li');
            li.textContent = `Match ${index + 1}: ${match.matchType} | Sets: ${match.setScores} | Games: ${match.gameScores}`;
            matchesList.appendChild(li);
        });
    }

    function renderPractices() {
        practicesList.innerHTML = '';
        practices.forEach((practice, index) => {
            const li = document.createElement('li');
            li.textContent = `Practice ${index + 1}: ${practice.timeSpent} minutes`;
            practicesList.appendChild(li);
        });
    }
});