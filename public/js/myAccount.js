function showContent(contentId, element) {
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.menu-option');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Hide all content sections
    const contents = document.querySelectorAll('.content-item');
    contents.forEach(content => content.classList.remove('active'));

    // Add active class to the clicked tab
    element.classList.add('active');

    // Show the corresponding content section
    document.getElementById(contentId).classList.add('active');
}

// Ensure the default tab (Option 1) is shown on page load
document.addEventListener('DOMContentLoaded', () => {
    const activeTab = document.querySelector('.menu-option.active');
    if (!activeTab) {
        document.querySelector('.menu-option').click();
    }
});

const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');

    togglePassword.addEventListener('click', function (e) {
        // Toggle the type attribute
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);

        // Toggle the eye / eye-slash icon
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });