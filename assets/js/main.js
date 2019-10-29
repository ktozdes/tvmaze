async function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return await JSON.parse(xmlHttp.responseText);
}

let searchResultContainer;
let list;


function addTVShow(parentElement, singleShow) {
    let article = document.createElement('article');
    article.className = "media";
    article.innerHTML = `
        <figure class="media-left">
            <p class="image is-64x64">
              <img src="${ singleShow.image !== null ? singleShow.image.medium : 'https://bulma.io/images/placeholders/128x128.png'}">
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <p>
                    <strong>${singleShow.name}</strong>
                    <time><small>${ singleShow.schedule.days.join(', ') }</small> <small>${ singleShow.schedule.time }</small></time>
                    ${singleShow.summary}
                </p>
                <button data-show-id="${singleShow.id}" class="button is-small casts-button">Cast</button>
                <div class="content is-small is-hidden has-background-white cast-container">
                    
                </div>
            </div>
        </div>
    `;

    let fragment = document.createDocumentFragment();
    fragment.appendChild(article);
    searchResultContainer.appendChild(fragment);
}

function addCast(parentElement, cast) {
    let article = document.createElement('article');
        article.className = "media";
    article.innerHTML = `
    <figure class="media-left">
        <p class="image is-64x64">
          <img src="${ cast.person.image !== null ? cast.person.image.medium : 'https://bulma.io/images/placeholders/128x128.png'}">
        </p>
    </figure>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>${cast.person.name}</strong>
            <br>
            <date>${cast.person.birthday}</date>
          </p>
        </div>
    `;
    parentElement.appendChild(article);
}

function initTVShow() {
    httpGet('http://api.tvmaze.com/shows')
    .then(data => {
        list = data;
        numberOfPages = getNumberOfPages();
        loadList();
    });
}


function searchTVShow() {
    let searchString = document.getElementById('search-text').value;
    let urlQuery =  (searchString.trim() == '') ? 'http://api.tvmaze.com/shows' : 'http://api.tvmaze.com/search/shows?q='+searchString;

    document.getElementById('search-title').innerHTML = (searchString.trim() == '') ? 'All TV Shows' : 'Search Result for <strong>'+searchString+'</strong>';
    
    httpGet(urlQuery)
    .then(data => {
        list = data;
        numberOfPages = getNumberOfPages();
        firstPage();
    });
}

function populateCasts(thisButton) {
    httpGet('http://api.tvmaze.com/shows/'+thisButton.getAttribute('data-show-id')+'/cast')
    .then(casts => {
        casts.sort(function(a, b){
            return new Date(b.person.birthday) - new Date(a.person.birthday);
        });

        if (casts.length < 1) {
            thisButton.setAttribute('disabled', 'disabled');
        }
        
        casts.forEach(function (cast, index) {
            addCast(thisButton.nextElementSibling, cast);
        });
        thisButton.classList.add('loaded');
    });
}

window.onload = function () {
    searchResultContainer = document.querySelector(".search-result-container");

    initTVShow();

    //searching tv show
    document.getElementById('search-button').onclick = function(){
        searchTVShow();
    }

    //populating show cast
    document.addEventListener('click',function(e){
        let thisButton = e.target;
        if(thisButton && thisButton.className.indexOf('casts-button') >= 0 ) {
            if(thisButton.className.indexOf('loaded') < 0 ) {
                populateCasts(thisButton);
            }
            thisButton.nextElementSibling.classList.toggle('is-hidden');
        }
     });
};






