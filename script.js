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

        if (!setScores) {
            alert('Please enter valid set scores.');
            return;
        }

        const match = { matchType, servesIn, servesOut, setScores };
        matches.push(match);
        localStorage.setItem('matches', JSON.stringify(matches));
        renderMatches();
        updateAnalytics();
    });

    // Practice Form Submission
    practiceForm?.addEventListener('submit', function (event) {
        event.preventDefault();
        const timeSpent = parseInt(document.getElementById('timeSpent').value) || 0;
        const effort = parseInt(document.getElementById('effort').value) || 0;
        const workOn = document.getElementById('workOn').value;

        if (timeSpent <= 0) {
            alert('Please enter a valid time spent practicing.');
            return;
        }

        const practice = { timeSpent, effort, workOn };
        practices.push(practice);
        localStorage.setItem('practices', JSON.stringify(practices));
        renderPractices();
        updateAnalytics();
    });

    function renderMatches() {
        matchesList.innerHTML = '';
        matches.forEach((match, index) => {
            const li = document.createElement('li');
            li.textContent = `Match ${index + 1}: ${match.matchType} | Serves In: ${match.servesIn} | Serves Out: ${match.servesOut} | Sets: ${match.setScores}`;
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
        const wins = matches.filter(match => {
            const [playerSets, opponentSets] = match.setScores.split(',').map(score => parseInt(score.split('-')[0]));
            return playerSets > opponentSets;
        }).length;
        const totalMatches = matches.length;
        const winPercentage = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

        const totalTimePlaying = matches.reduce((sum, match) => sum + 60, 0); // Assuming 60 minutes per match
        const totalTimePracticing = practices.reduce((sum, practice) => sum + practice.timeSpent, 0);

        const totalServesIn = matches.reduce((sum, match) => sum + match.servesIn, 0);
        const totalServesOut = matches.reduce((sum, match) => sum + match.servesOut, 0);

        // Render Charts
        if (document.getElementById('winPercentageChart') && totalMatches > 0) {
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

        if (document.getElementById('timeSpentChart') && (totalTimePlaying > 0 || totalTimePracticing > 0)) {
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

        if (document.getElementById('servesInOutChart') && (totalServesIn > 0 || totalServesOut > 0)) {
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

    // Download Analytics
    document.getElementById('downloadAnalytics')?.addEventListener('click', function () {
        const wins = matches.filter(match => {
            const [playerSets, opponentSets] = match.setScores.split(',').map(score => parseInt(score.split('-')[0]));
            return playerSets > opponentSets;
        }).length;
        const totalMatches = matches.length;
        const winPercentage = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

        const totalTimePlaying = matches.reduce((sum, match) => sum + 60, 0); // Assuming 60 minutes per match
        const totalTimePracticing = practices.reduce((sum, practice) => sum + practice.timeSpent, 0);

        const totalServesIn = matches.reduce((sum, match) => sum + match.servesIn, 0);
        const totalServesOut = matches.reduce((sum, match) => sum + match.servesOut, 0);

        const analyticsText = `
Win Percentage: ${winPercentage}%
Total Time Playing: ${totalTimePlaying} minutes
Total Time Practicing: ${totalTimePracticing} minutes
Serves In: ${totalServesIn}
Serves Out: ${totalServesOut}
        `;

        const blob = new Blob([analyticsText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tennis-analytics.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Randomized Quotes on Home Page
    if (document.getElementById('quote')) {
        const quotes = [
            "The difference between a champion and the rest is not a better body. It is a better mind." - Jack Lengyel,
            "Tennis is 85% mental. The other 15% is physical." - Jack Nicklaus,
            "Tennis is a sport of inches, where millimeters make the difference." - Jimmy Connors,
            "Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        document.getElementById('quote').textContent = randomQuote;
    }

    // Initial Render
    renderMatches();
    renderPractices();
    updateAnalytics();
});
