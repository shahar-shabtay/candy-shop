async function showFilter() {
    const advancedSearchDiv = document.getElementById('advancedSearch');
        
    if (advancedSearchDiv) {
        if (advancedSearchDiv.style.display === 'none' || advancedSearchDiv.style.display === '') {
            advancedSearchDiv.style.display = 'block';
        } else {
            advancedSearchDiv.style.display = 'none';
        }
    }
}

async function searchFilter() {
    const flavor = document.getElementById('flavor').value;
    const allergans = document.getElementById('allergans').value;
    const sweetType = document.getElementById('sweetType').value;
    const kosher = document.getElementById('kosher').value;
    const searchParams = new URLSearchParams();
    if (flavor !== 'All') searchParams.append('flavor', flavor);
    if (allergans !== 'All') searchParams.append('allergans', allergans);
    if (sweetType !== 'All') searchParams.append('sweetType', sweetType);
    if (kosher !== 'All') searchParams.append('kosher', kosher);

    window.location.href = '/search/filter?' + searchParams.toString();
}