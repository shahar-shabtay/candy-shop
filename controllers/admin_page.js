function showContent(optionId, element) {
    // Hide all content items
    var contents = document.getElementsByClassName('content-item');
    for (var i = 0; i < contents.length; i++) {
        contents[i].style.display = 'none';
    }

    // Show the selected content item
    document.getElementById(optionId).style.display = 'block';

    // Remove 'active' class from all menu options
    var options = document.getElementsByClassName('menu-option');
    for (var i = 0; i < options.length; i++) {
        options[i].classList.remove('active');
    }

    // Add 'active' class to the clicked option
    element.classList.add('active');
}
