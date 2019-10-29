var pageList = new Array();
var currentPage = 1;
var numberPerPage = 10;
var numberOfPages = 0;


    
function getNumberOfPages() {
    return Math.ceil(list.length / numberPerPage);
}

function nextPage() {
    currentPage += 1;
    loadList();
}

function previousPage() {
    currentPage -= 1;
    loadList();
}

function firstPage() {
    currentPage = 1;
    loadList();
}

function lastPage() {
    currentPage = numberOfPages;
    loadList();
}

function loadList() {
    var begin = ((currentPage - 1) * numberPerPage);
    var end = begin + numberPerPage;

    pageList = list.slice(begin, end);
    drawList();
    check();
}

function drawList() {
    searchResultContainer.innerHTML = '';
    console.log(pageList);
    if (pageList.length == 0) {
        searchResultContainer.innerHTML = 'Nothing found by this keyword(s)';
    }
    else{
        for (r = 0; r < pageList.length; r++) {
            if (typeof pageList[0].show !== 'undefined'){
                addTVShow(searchResultContainer, pageList[r].show);
            }
            else{
                addTVShow(searchResultContainer, pageList[r]);
            }
        }
    }
}

function check() {
    document.getElementById("next").disabled = currentPage == numberOfPages || numberOfPages == 0 ? true : false;
    document.getElementById("previous").disabled = currentPage == 1 || numberOfPages == 0? true : false;
    document.getElementById("first").disabled = currentPage == 1 || numberOfPages == 0? true : false;
    document.getElementById("last").disabled = currentPage == numberOfPages || numberOfPages == 0? true : false;
}

function load() {
    
}
    
window.onload = load;