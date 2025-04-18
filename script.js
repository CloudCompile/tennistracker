document.addEventListener('DOMContentLoaded', function () {
    const matchForm = document.getElementById('matchForm');
    const practiceForm = document.getElementById('practiceForm');
    const matchesList = document.getElementById('matches');
    const practicesList = document.getElementById('practices');

    let matches = JSON.parse(localStorage.getItem('matches')) || [];
    let practices = JSON.parse(localStorage.getItem('practices')) || [];

    // Match Form Submission
    matchForm?.addEventListener('submit', function (event) {
        event.preventDefault();
        const matchType = document.getElementById('matchType').value;
        const servesIn = parseInt(document.getElementById('servesIn').value) || 0;
        const servesOut = parseInt(document.getElementById('servesOut').value) || 0;
        const setScores = document.getElementById('setScores').value;
        const gameScores = document.getElementById('gameScores').value;

        const match = { matchType, servesIn, servesOut, setScores, gameScores };
        matches.push(match);
        localStorage.setItem('matches', JSON.stringify(matches));
        renderMatches();
        matchForm.reset();
        updateAnalytics();
    });

    // Practice Form Submission
    practiceForm?.addEventListener('submit', function (event) {
        event.preventDefault();
        const timeSpent = parseInt(document.getElementById('timeSpent').value) || 0;
        const effort = parseInt(document.getElementById('effort').value) || 0;
        const workOn = document.getElementById('workOn').value;

        const practice = { timeSpent, effort, workOn };
        practices.push(practice);
        localStorage.setItem('practices', JSON.stringify(practices));
        renderPractices();
        practiceForm.reset();
        updateAnalytics();
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

    function updateAnalytics() {
        // Win Percentage Calculation
        const wins = matches.filter(match => {
            const [playerSets, opponentSets] = match.setScores.split(',').map(score => parseInt(score.split('-')[0]));
            return playerSets > opponentSets;
        }).length;
        const totalMatches = matches.length;
        const winPercentage = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

        // Time Spent Playing vs Practicing
        const totalTimePlaying = matches.reduce((sum, match) => sum + 60, 0); // Assuming 60 minutes per match
        const totalTimePracticing = practices.reduce((sum, practice) => sum + practice.timeSpent, 0);

        // Serves In/Out
        const totalServesIn = matches.reduce((sum, match) => sum + match.servesIn, 0);
        const totalServesOut = matches.reduce((sum, match) => sum + match.servesOut, 0);

        // Update Charts
        if (document.getElementById('winPercentageChart')) {
            new Chart(document.getElementById('winPercentageChart'), {
                type: 'pie',
                data: {
                    labels: ['Wins', 'Losses'],
                    datasets: [{
                        data: [winPercentage, 100 - winPercentage],
                        backgroundColor: ['#4CAF50', '#f44336']
                    }]
                },
                options: { responsive: true }
            });
        }

        if (document.getElementById('timeSpentChart')) {
            new Chart(document.getElementById('timeSpentChart'), {
                type: 'bar',
                data: {
                    labels: ['Playing', 'Practicing'],
                    datasets: [{
                        label: 'Time Spent (minutes)',
                        data: [totalTimePlaying, totalTimePracticing],
                        backgroundColor: ['#4CAF50', '#2196F3']
                    }]
                },
                options: {
                    responsive: true,
                    scales: { y: { beginAtZero: true } }
                }
            });
        }

        if (document.getElementById('servesInOutChart')) {
            new Chart(document.getElementById('servesInOutChart'), {
                type: 'doughnut',
                data: {
                    labels: ['Serves In', 'Serves Out'],
                    datasets: [{
                        data: [totalServesIn, totalServesOut],
                        backgroundColor: ['#4CAF50', '#FFC107']
                    }]
                },
                options: { responsive: true }
            });
        }
    }

    // Initial Render
    renderMatches();
    renderPractices();
    updateAnalytics();
});
