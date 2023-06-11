

const global ={
    currentpage:window.location.pathname,
    search:{
        term:'',
        type:'',
        page:1,
        totalPages:1,
        totalresults:1
    },
    api:{
      apikey :'252a2673ee943f473fd240beb6f2a945',
      apiurl :'https://api.themoviedb.org/3/'
    },
};
async function popularmovies(){
    const {results} = await fetchApiData('movie/popular')
    results.forEach((movie)=>{
        const div =document.createElement('div');
        div.className='card';
        div.innerHTML=`
        <a href="movie-details.html?id=${movie.id}">
            ${
                movie.poster_path?
                `<img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}"
              />`:
              `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">${movie.release_date}</small>
            </p>
          </div>
        `
        document.querySelector('#popular-movies').appendChild(div)
    })
}
async function popularShows(){
    const {results} = await fetchApiData('tv/popular')
  
    results.forEach((show)=>{
        const div =document.createElement('div');
        div.className='card';
        div.innerHTML=`
        <a href="tv-details.html?id=${show.id}">
            ${
                show.poster_path?
                `<img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="${show.name}"
              />`:
              `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">${show.first_air_date}</small>
            </p>
          </div>
        `
        document.querySelector('#popular-shows').appendChild(div)
    })
}
async function showDetails(){
    const showId= window.location.search.split('=')[1];

    const show = await fetchApiData(`tv/${showId}`);
    console.log(show);

        displayBackImg('tv',show.backdrop_path);

        const div =document.createElement('div');
        
        div.innerHTML=`
        <div class="details-top">
          <div>
          ${
            show.poster_path?
            `<img
            src="https://image.tmdb.org/t/p/w500${show.poster_path}"
            class="card-img-top"
            alt="${show.name}"
          />`:
          `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${show.name}"
        />`
        }
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)}/ 10
            </p>
            <p class="text-muted">Last Air Date:${show.last_air_date}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${show.genres.map((genre)=>`<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.episode_number}
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies.map((company)=>`<span>${company.name}, </span>`).join('')}</div>
        </div>
        </div>
        `
        document.querySelector('#show-details').appendChild(div)
}
async function movieDetails(){
    const movieId= window.location.search.split('=')[1];

    const movie = await fetchApiData(`movie/${movieId}`);
    console.log(movie);

        displayBackImg('movie',movie.backdrop_path);

        const div =document.createElement('div');
        
        div.innerHTML=`
        <div class="details-top">
          <div>
          ${
            movie.poster_path?
            `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
          />`:
          `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${movie.title}"
        />`
        }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)}/ 10
            </p>
            <p class="text-muted">Release Date:${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre)=>`<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${numberWithCommas(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${numberWithCommas(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map((company)=>`<span>${company.name}, </span>`).join('')}</div>
        </div>
        `
        document.querySelector('#movie-details').appendChild(div)
}

async function search(){
    const queryString = window.location.search;
    const urlparams= new URLSearchParams(queryString);
    global.search.type = urlparams.get('type');
    global.search.term = urlparams.get('search-term');
    if(global.search.term !=='' && global.search.term !==null){
      const {results, total_pages,page,total_results } = await searchApiData();
      global.search.page=page;
      global.search.totalPages =total_pages;
      global.search.totalresults = total_results;
      if(results.length === 0){
        showAlert('No Results found' );
        return;
      }
      
      displaySearchResults(results);
      document.querySelector('#search-term').value='';
    }
    else{
      showAlert('Please enter a search term','error');
    }

}
function displaySearchResults(results){
  document.querySelector('#search-results').innerHTML='';
  document.querySelector('#search-results-heading').innerHTML='';
  document.querySelector('#pagination').innerHTML='';
if(global.search.type === 'movie'){
  results.forEach((movie)=>{
    const div =document.createElement('div');
    div.className='card';
    div.innerHTML=`
    <a href="movie-details.html?id=${movie.id}">
        ${
            movie.poster_path?
            `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
          />`:
          `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${movie.title}"
        />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">
          <small class="text-muted">${movie.release_date}</small>
        </p>
      </div>
    `
    document.querySelector('#search-results-heading').innerHTML=`
    <h2>${results.length} of ${global.search.totalresults} Results for ${global.search.term}</h2>
    `
    document.querySelector('#search-results').appendChild(div)
})
}
else{
  results.forEach((show)=>{
    const div =document.createElement('div');
    div.className='card';
    div.innerHTML=`
    <a href="tv-details.html?id=${show.id}">
        ${
            show.poster_path?
            `<img
            src="https://image.tmdb.org/t/p/w500${show.poster_path}"
            class="card-img-top"
            alt="${show.name}"
          />`:
          `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${show.name}"
        />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text">
          <small class="text-muted">${show.first_air_date}</small>
        </p>
      </div>
    `
    document.querySelector('#search-results-heading').innerHTML=`
    <h2>${results.length} of ${global.search.totalresults} Results for ${global.search.term}</h2>
    `
    document.querySelector('#search-results').appendChild(div)
})
}
displaypagination();
}
function displaypagination(){
  const div =document.createElement('div');
    div.className='pagination';
    div.innerHTML=`
  <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`
          document.querySelector('#pagination').appendChild(div)

  if(global.search.page === 1){
    document.querySelector('#prev').disabled = true;
  }
  if(global.search.page === global.search.totalPages){
    document.querySelector('#next').disabled = true;
}
document.querySelector('#next').addEventListener('click',async ()=>{
  global.search.page++;
  const {results ,total_pages} = await searchApiData();
  displaySearchResults(results);
})
document.querySelector('#prev').addEventListener('click',async ()=>{
  global.search.page--;
  const {results ,total_pages} = await searchApiData();
  displaySearchResults(results);
})

}

async function searchApiData(){
  const Api_Key = global.api.apikey;
  const Url = global.api.apiurl;
  showSpinner();
  const response = await fetch(`${Url}search/${global.search.type}?api_key=${Api_Key}&language=en-US&query=${global.search.term}&page=${global.search.page}`);
  const data = await response.json();
  hideSpinner();
  return data;
}

function displayBackImg(type, bpath){
    const overlaydiv=document.createElement('div');
    overlaydiv.style.backgroundImage=`url(https://image.tmdb.org/t/p/original/${bpath})`;
    overlaydiv.style.backgroundPosition='center';
    overlaydiv.style.backgroundRepeat='no-repeat';
    overlaydiv.style.height='100vh'
    overlaydiv.style.width='100vw'
    overlaydiv.style.position='absolute';
    overlaydiv.style.top='0';
    overlaydiv.style.left='0';
    overlaydiv.style.zIndex='-1';
    overlaydiv.style.opacity='0.2';

    if(type==='movie'){
        document.querySelector('#movie-details').appendChild(overlaydiv)
    }
    else{
        document.querySelector('#show-details').appendChild(overlaydiv)
    }
}

async function displayslider(){
    const {results} = await fetchApiData('movie/now_playing')
    console.log(results)
    results.forEach((movie)=>{
        const div =document.createElement('div');
        div.className='swiper-slide';
        div.innerHTML=`
        <a href="movie-details.html?id=${movie.id}">
            ${
                movie.poster_path?
                `<img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}"
              />`:
              `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
            }
          </a>
        <h4 class="swiper-rating">
          <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)}/ 10
        </h4>
      `
      document.querySelector('.swiper-wrapper').appendChild(div);

      initswiper();
});
}
function initswiper(){
    const swiper = new Swiper('.swiper',{
        slidePerview:1,
        spaceBetween:30,
        freeMode:true,
        loop:true,
        autoplay:{
            delay:3000,
            displayOnInteraction:false
        },
        breakpoints:{
            500:{
                slidesPerView:2
            },
            700:{
                slidesPerView:3
            },
            1200:{
                slidesPerView:4
            },
        }
    })
}
async function fetchApiData(endpoint){
    const Api_Key = global.api.apikey;
    const Url = global.api.apiurl;
    showSpinner();
    const response = await fetch(`${Url}${endpoint}?api_key=${Api_Key}&language=en-US`);
    const data = await response.json();
    hideSpinner();
    return data;
}
function showSpinner(){
    document.querySelector('.spinner').classList.add('show');
}
function hideSpinner(){
    document.querySelector('.spinner').classList.remove('show');
}
function highlightactivelink(){
    const links=document.querySelectorAll('.nav-link');
    links.forEach((link)=>{
        if(link.getAttribute('href')=== global.currentpage){
            link.classList.add('active');
        }
    })
    
}
function showAlert(message,className='error'){
  const alertEL =document.createElement('div');
  alertEL.classList.add('alert',className);
  alertEL.textContent=message;
  document.querySelector('#alert').appendChild(alertEL);

  setTimeout(() => {
    alertEL.remove();
  }, 3000);
}

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

function init(){
    switch(global.currentpage){
        case '/':
        case '/index.html':
            displayslider();
            popularmovies();
        break;
        case '/shows.html':
            popularShows();
        break;
        case '/movie-details.html':
            movieDetails();
        break;
        case '/tv-details.html':
            showDetails();
        break;
        case '/search.html':
          search();
        break;
    
    }
    highlightactivelink();
}


document.addEventListener('DOMContentLoaded',init);