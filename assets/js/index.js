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
const randomBtn = $('.btn-random')


const app = {
    currentIndex: 0,
    isRandom: false,
    songs: [
        {
            name: 'Loser',
            singer: 'Charlie Puth',
            path: './assets/audio/loser.mp3',
            image: './assets/img/charlie-puth.jpeg'
        },
        {
            name: 'Stay',
            singer: 'Justin Bieber',
            path: './assets/audio/Stay.mp3',
            image: './assets/img/justin-bieber.webp'
        },
        {
            name: 'See Tình',
            singer: 'Hoàng Thuỳ Linh',
            path: './assets/audio/see-tinh.mp3',
            image: './assets/img/hoangthuylinh.jpeg'
        },
        {
            name: 'Xin Đừng Lặng Im',
            singer: 'Soobin Hoàng Sơn',
            path: './assets/audio/xindunglangim.mp3',
            image: './assets/img/hip-hop.jpeg'
        },
        {
            name: 'Thiên Lý Ơi',
            singer: 'J97',
            path: './assets/audio/thienlyoi.mp3',
            image: './assets/img/j97.jpeg'
        },
        {
            name: 'Xin Đừng Lặng Im',
            singer: 'Soobin Hoàng Sơn',
            path: './assets/audio/xindunglangim.mp3',
            image: './assets/img/hip-hop.jpeg'
        },
        {
            name: 'Xin Đừng Lặng Im',
            singer: 'Soobin Hoàng Sơn',
            path: './assets/audio/xindunglangim.mp3',
            image: './assets/img/hip-hop.jpeg'
        },
        {
            name: 'Xin Đừng Lặng Im',
            singer: 'Soobin Hoàng Sơn',
            path: './assets/audio/xindunglangim.mp3',
            image: './assets/img/hip-hop.jpeg'
        },
        {
            name: 'Xin Đừng Lặng Im',
            singer: 'Soobin Hoàng Sơn',
            path: './assets/audio/xindunglangim.mp3',
            image: './assets/img/hip-hop.jpeg'
        },
        {
            name: 'Xin Đừng Lặng Im',
            singer: 'Soobin Hoàng Sơn',
            path: './assets/audio/xindunglangim.mp3',
            image: './assets/img/hip-hop.jpeg'
        },
        {
            name: 'Xin Đừng Lặng Im',
            singer: 'Soobin Hoàng Sơn',
            path: './assets/audio/xindunglangim.mp3',
            image: './assets/img/hip-hop.jpeg'
        },
    ],
    render() {
        const htmls = this.songs.map(song => {
            return `
                <div class="song">
                    <div class="thumb" style="background-image: url(${song.image});">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
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
            progress.value = progressPercent
        }

        // when progress bar is updated (tua song)
        progress.onchange = function () {
            const seekTime = this.value * audio.duration / 100
            audio.currentTime = seekTime
        }

        function nextSongEvent() {
            if (app.isRandom) {
                app.randomSong()
            } else {
                app.nextSong()
            }
            audio.play()
        }

        // when clicking next song button
        nextBtn.onclick = function () {
            nextSongEvent()
        }

        // when clicking next song button
        prevBtn.onclick = function () {
            if (app.isRandom) {
                app.randomSong()
            } else {
                app.prevSong()
            }
            audio.play()
        }

        // when clicking random button
        randomBtn.onclick = function () {
            app.isRandom = !app.isRandom
            this.classList.toggle('active')
        }

        // when song ends, handle playing next song or repeat
        audio.onended = function () {
            nextSongEvent()
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

        // Listen/ handle DOM events
        this.handleEvents()

        // Load current song
        this.loadCurrentSong()

        // Render playlist
        this.render()
    }

}

app.start()