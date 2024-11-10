document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('statisticsModel');
    const openModalButton = document.getElementById('openstatisticsModel');
    const closeButton = modal.querySelector('.close-button');
    let myChart = null;

    async function fetchKosherData() {
        try {
            const response = await fetch('/products/kosherData');
            if (!response.ok) throw new Error('Failed to fetch kosher data');
            
            const data = await response.json();
            return [data.kosher, data.nonKosher];
        } catch (error) {
            console.error('Error:', error);
            return [0, 0];
        }
    }

    // Function to create the chart
    async function createChart() {
        const counts = await fetchKosherData();
        const labels = ['Kosher', 'Non-Kosher'];
        const ctx = document.getElementById('candiesChart').getContext('2d');
    
        if (myChart) {
            try {
                myChart.destroy();
            } catch (error) {
                console.error('Error destroying previous chart:', error);
            }
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
        setTimeout(createChart, 500);
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