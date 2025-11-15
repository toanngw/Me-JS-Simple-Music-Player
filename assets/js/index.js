const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cdThumb = $('.cd-thumb')
const cdWidth = cdThumb.offsetWidth
const cdHeight = cdThumb.offsetHeight;
const heading = $('header h2')
const audio = $('audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random i')
const repeatBtn = $('.btn-repeat i')

const app = {
    currentIndex: 0,
    isRandom: false,
    isRepeated: false,
    songs: [
        {
            name: 'Loser',
            singer: 'Charlie Puth',
            path: './assets/audio/loser.mp3',
            image: './assets/img/loser.jpeg'
        },
        {
            name: 'Stay',
            singer: 'Justin Bieber',
            path: './assets/audio/stay.mp3',
            image: './assets/img/stay.webp'
        },
        {
            name: 'Havana',
            singer: 'Camila Cabello',
            path: './assets/audio/havana.mp3',
            image: './assets/img/havana.png'
        },
        {
            name: 'Chúng ta...',
            singer: 'J97',
            path: './assets/audio/chungtaroisehanhphuc.mp3',
            image: './assets/img/j97.jpg'
        },
        {
            name: 'Uptown Funk',
            singer: 'Mark Ronson',
            path: './assets/audio/uptownfunk.mp3',
            image: './assets/img/uptownfunk.webp'
        },
        {
            name: 'My Eyes',
            singer: 'Travis Scott',
            path: './assets/audio/myeyes.mp3',
            image: './assets/img/myeyes.jpg'
        },
        {
            name: 'Comethru',
            singer: 'Jeremy Zucker',
            path: './assets/audio/comethru.mp3',
            image: './assets/img/comethru.jpg'
        },
        {
            name: 'Cornfield Chase',
            singer: 'Hans Zimmer',
            path: './assets/audio/cornfieldchase.mp3',
            image: './assets/img/cornfieldchase.jpeg'
        },
        {
            name: 'Hold On',
            singer: 'Justin Bieber',
            path: './assets/audio/holdon.mp3',
            image: './assets/img/holdon.webp'
        },
        {
            name: 'Closer',
            singer: 'The Chainsmokers',
            path: './assets/audio/closer.mp3',
            image: './assets/img/closer.jpg'
        },
        {
            name: 'A Lot',
            singer: '21 Savage',
            path: './assets/audio/alot.mp3',
            image: './assets/img/alot.jpg'
        }
    ],
    render() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}">
                    <div class="thumb" style="background-image: url(${song.image});">
                    </div>
                    <div class="body">
                        <h4 class="title">${song.name}</h4>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="bi bi-three-dots"></i>
                    </div>
                </div>
            `
        })

        $('.playlist').innerHTML = htmls.join('');

    },
    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents() {
        // update the track/progress bar when first load
        audio.addEventListener('loadedmetadata', () => {
            progress.value = 0;
            progress.style.setProperty('--percent', '0%');
        });

        // handle rotating disk
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10 times
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // handle when scrolling, zoom in, zoom out 
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            const newCdHeight = cdHeight - scrollTop
            cdThumb.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cdThumb.style.height = newCdHeight > 0 ? newCdHeight + 'px' : 0;
            cdThumb.style.opacity = newCdWidth / cdWidth
        }

        // Handle when clicking play button
        playBtn.onclick = () => {
            if (audio.paused) {
                audio.play()
            } else {
                audio.pause()
            }
        }
        // when song is playing
        audio.onplay = function () {
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // when song is paused
        audio.onpause = function () {
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // when playback time is updated
        audio.ontimeupdate = function () {
            const progressPercent = Math.floor(this.currentTime / this.duration * 100)
            // when first load page, audio.duration = 0 -> progress = NaN
            if (progressPercent) {
                progress.value = progressPercent;
                progress.style.setProperty('--percent', progressPercent + '%');
            }
        }

        // when progress bar is updated (tua song)
        progress.onchange = function () {
            const percent = this.value
            const seekTime = this.value / 100 * audio.duration
            audio.currentTime = seekTime
        }

        // when clicking next song button
        nextBtn.onclick = function nextSongEvent() {
            if (app.isRandom) {
                app.randomSong()
            } else {
                app.nextSong()
            }
            audio.play()
            app.render()
        }

        // when clicking next song button
        prevBtn.onclick = function () {
            if (app.isRandom) {
                app.randomSong()
            } else {
                app.prevSong()
            }
            audio.play()
            app.render()
        }

        // when clicking random button
        randomBtn.onclick = function () {
            app.isRandom = !app.isRandom
            this.classList.toggle('active')
        }

        // when click on repeat button
        repeatBtn.onclick = function () {
            app.isRepeated = !app.isRepeated
            this.classList.toggle('active')
        }

        // when song ends, handle playing next song or repeat
        audio.onended = function () {
            if (!app.isRepeated) {
                nextBtn.click()
            } else {
                audio.play()
            }
        }

    },
    loadCurrentSong() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    randomSong() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.songs.length)
        } while (randomIndex == this.currentIndex);

        this.currentIndex = randomIndex
        this.loadCurrentSong()
    },
    prevSong() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    nextSong() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    start() {
        // Define properties for object
        this.defineProperties()

        // Load current song
        this.loadCurrentSong()

        // Render playlist
        this.render()

        // Listen/ handle DOM events
        this.handleEvents()
    }

}

app.start()