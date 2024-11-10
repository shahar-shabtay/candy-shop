document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('adminStatisticsModel');
    const openModalButton = document.getElementById('openAdminStatisticsModel');
    const closeButton = modal.querySelector('.close-button');
    let adminChart = null;

    // Function to fetch admin data from the server
    async function fetchAdminData() {
        try {
            const response = await fetch('/products/adminData');
            if (!response.ok) throw new Error('Failed to fetch admin data');

            const data = await response.json();

            if (data && data.Admin !== undefined && data.nonAdmin !== undefined) {
                return [data.Admin, data.nonAdmin];
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            console.error('Error:', error);
            return [0, 0]
        }
    }

    async function createAdminChart() {
        const counts = await fetchAdminData();
        const labels = ['Admin', 'Non-Admin'];
        const ctx = document.getElementById('adminChart').getContext('2d');

        if (adminChart) {
            try {
                adminChart.destroy();
            } catch (error) {
                console.error('Error destroying previous chart:', error);
            }
        }

        adminChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Users by Role',
                    data: counts,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',  // Admin
                        'rgba(255, 99, 132, 0.6)'   // Non-Admin
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

    openModalButton.addEventListener('click', (event) => {
        event.preventDefault();
        modal.style.display = 'block';
        setTimeout(createAdminChart, 500);
    });

    // Close modal when clicking the close button
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        if (adminChart) {
            adminChart.destroy();
            adminChart = null;
        }
    });

    // Close modal when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            if (adminChart) {
                adminChart.destroy();
                adminChart = null;
            }
        }
    });
});
