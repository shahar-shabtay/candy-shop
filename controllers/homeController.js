// Function to render the home page
function renderHomePage(req, res) {
    res.render('home');  // Render the 'home.ejs' view
}

module.exports = {
    renderHomePage,
};
