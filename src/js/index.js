import axios from "axios"
import Notiflix from 'notiflix'
import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css"

const searchForm = document.querySelector('.search-form')
const input = document.querySelector('.searchQuery')
const gallery = document.querySelector('.gallery')
const addMore = document.querySelector('.load-more')

const baseURL = `https://pixabay.com/api/`
const lightbox = new SimpleLightbox('.gallery a', {})

let currentValue
let newis = true
let currentPage = 1

searchForm.addEventListener('submit', function(event) {
    event.preventDefault(event)
    if(currentValue === input.value) {
        currentPage += 1
        newis = false
    } else {
        gallery.innerHTML = ''
        currentValue = input.value
        currentPage = 1
        newis = true
    }
    findCardsRender()
})

addMore.addEventListener('click', function() {
    currentPage += 1
    newis = false
    findCardsRender()
})

async function findCards() {
    const params = new URLSearchParams({
        page: currentPage,
        per_page: 40,
        key: "39209213-26e6de3edfb0581cbb486c9d2",
        q: currentValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
    })

    let responce = await axios.get(`${baseURL}?${params}`)
    return responce
}

function findCardsRender() {
    findCards()
        .then(resp => {
            if(resp.data.total === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
            } else {
                if(newis) {
                    Notiflix.Notify.success(`Hooray! We found ${resp.data.totalHits} images.`)
                }
                if(resp.data.hits.length < 40) {
                    console.log(resp.data.hits.length)
                    addMore.style.display = 'none'
                } else {
                    addMore.style.display = 'inline'
                }
                renderGallery(resp.data)
                
            }
        })
        .catch(error => {
            console.log(error)
            Notiflix.Notify.warning('Oops! Something went wrong! Try reloading the page!')
        })
}

function renderGallery(cards) {
    console.log(cards)
    const markup = cards.hits
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads })  => {
            return `<a class="gallery__link" href="${largeImageURL}" data-alt="${tags}">
                        <div class="photo-card">
                            <img class="gallery__image" src="${webformatURL}" width="400" alt="${tags}" loading="lazy">
                            <div class="info">
                                <p class="info-item"><b>Likes</b> ${likes} </p>
                                <p class="info-item"><b>Views</b> ${views} </p>
                                <p class="info-item"><b>Comments</b> ${comments} </p>
                                <p class="info-item"><b>Downloads</b> ${downloads} </p>
                            </div>
                        </div>
                    </a>`
        })
        .join("")
        gallery.insertAdjacentHTML('beforeend', markup)
        lightbox.refresh()
}

//pikmin