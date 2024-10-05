document.addEventListener('DOMContentLoaded', function() {
    // Modal and chart logic
    const modal = document.getElementById('statisticsModel');
    const openModalButton = document.getElementById('openstatisticsModel');
    const closeButton = modal.querySelector('.close-button');
    let myChart = null;

    // Function to create the chart
    function createChart() {
        const labels = ['Kosher', 'Non-Kosher'];
        const counts = [50, 50];
        const ctx = document.getElementById('candiesChart').getContext('2d');

        // Destroy previous chart instance if exists to prevent duplicates
        if (myChart) {
            myChart.destroy();
        }

        myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Candies by Category',
                    data: counts,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',  // Kosher
                        'rgba(255, 99, 132, 0.6)'   // Non-Kosher
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Open modal and create chart
    openModalButton.addEventListener('click', (event) => {
        event.preventDefault();
        modal.style.display = 'block';

        // Give the modal some time to be fully rendered, then create the chart
        setTimeout(createChart, 300);  // Increased timeout to 300ms
    });

    // Close modal when clicking the close button
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});