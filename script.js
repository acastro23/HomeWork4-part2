document.addEventListener('DOMContentLoaded', () => {
    const pokeImg = [
        { name: 'Bulbasaur', img: 'Bulbasaur.png' },
        { name: 'Charmander', img: 'Charmander.png' },
        { name: 'Pikachu', img: 'Pikachu.png' },
        { name: 'Squirtle', img: 'Squirtle.png' },
        { name: 'Eevee', img: 'Eevee.png' },
        { name: 'Mewtwo', img: 'Mewtwo.png' }
    ];
    let countdown, difficultyTime, gameDuration;
    let cardArray, ChosenCards = [], ChosenCardsID = [], matchesCount = 0;
    let canFlip = true;
    const grid = document.querySelector('#board');
    const myTimer = document.querySelector('#timer');
    const difficultyConfig = {
        easy: { memorizeTime: 8000, gameTime: 120 },
        medium: { memorizeTime: 5000, gameTime: 150 },
        hard: { memorizeTime: 3000, gameTime: 180 }
    };

    function MusicVolume(volume) {
        const bgMusic = document.getElementById('background-music');
        if (bgMusic) {
            bgMusic.volume = volume;
        }
    }

    function shuffleCards(array) {
        array.sort(() => 0.5 - Math.random());
    }

    function initializeCardArray(numPairs) {
        let tempArray = [];
        for (let i = 0; i < numPairs; i++) {
            tempArray.push(pokeImg[i], pokeImg[i]);
        }
        shuffleCards(tempArray);
        return tempArray;
    }

    function flipCard() {
        if (!canFlip) return;
        let cardId = this.getAttribute('data-id');
        if (!ChosenCardsID.includes(cardId)) {
            ChosenCards.push(cardArray[cardId].name);
            ChosenCardsID.push(cardId);
            this.classList.remove('flip');
            if (ChosenCards.length === 2) {
                canFlip = false;
                setTimeout(() => {
                    checkForMatch();
                    canFlip = true;
                }, 500);
            }
        }
    }

    function checkForMatch() {
        const cards = document.querySelectorAll('.card');
        const [firstId, secondId] = ChosenCardsID;
        if (ChosenCards[0] === ChosenCards[1]) {
            setTimeout(() => {
                removeListeners(firstId, secondId);
                matchesCount++;
                if (matchesCount === cardArray.length / 2) {
                    setTimeout(() => {
                        alert("Congratulations! You Win! Click Ok to return to the menu");
                        window.location.href = 'index.html';
                    }, 500);
                }
            }, 500);
        } else {
            setTimeout(() => flipBack(firstId, secondId), 500);
        }
        ChosenCards = [];
        ChosenCardsID = [];
    }

    function removeListeners(firstId, secondId) {
        const cards = document.querySelectorAll('.card');
        cards[firstId].removeEventListener('click', flipCard);
        cards[secondId].removeEventListener('click', flipCard);
    }

    function flipBack(firstId, secondId) {
        const cards = document.querySelectorAll('.card');
        cards[firstId].classList.add('flip');
        cards[secondId].classList.add('flip');
    }

    function startTimer() {
        let time = gameDuration;
        updateTimerDisplay(time);
        countdown = setInterval(() => {
            time--;
            updateTimerDisplay(time);
            if (time <= 0) {
                clearInterval(countdown);
                alert("Time's up! Try again.");
                resetGame();
            }
        }, 1000);
    }

    function updateTimerDisplay(time) {
        let minutes = parseInt(time / 60, 10);
        let seconds = parseInt(time % 60, 10);
        myTimer.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function Board() {
        grid.innerHTML = '';
        cardArray.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.setAttribute('data-id', index);
            cardElement.innerHTML = `<img src="${card.img}" class="front"><img src="Pokeball.png" class="back">`;
            grid.appendChild(cardElement);
            cardElement.addEventListener('click', flipCard);
        });

        setTimeout(() => grid.querySelectorAll('.card').forEach(card => card.classList.add('flip')), difficultyTime);
        document.getElementById('reset-button').style.display = 'block';
        startTimer();
    }

    function resetGame() {
        clearInterval(countdown);
        matchesCount = 0;
        myTimer.textContent = `${Math.floor(gameDuration / 60)}:${gameDuration % 60 < 10 ? '0' : ''}${gameDuration % 60}`;
        grid.innerHTML = '';
        showSection('intro');
        ChosenCards = [];
        ChosenCardsID = [];
    }

    function showSection(sectionId) {
        ['intro', 'difficulty-selection', 'gameStuff'].forEach(id => {
            document.getElementById(id).style.display = id === sectionId ? 'block' : 'none';
        });
    }

    window.selectDifficulty = function(difficulty) {
        difficultyTime = difficultyConfig[difficulty].memorizeTime;
        gameDuration = difficultyConfig[difficulty].gameTime;
        showSection('gameStuff');
        Board();
        startMusic();
    };

    window.selectCards = function(num) {
        cardArray = initializeCardArray(num / 2);
        showSection('difficulty-selection');
    };

    window.resetGame = resetGame;

    function startMusic() {
        MusicVolume(0.1);
        const bgMusic = document.getElementById('background-music');
        if (bgMusic) {
            bgMusic.play().catch(e => console.error('Audio play failed:', e));
        }
    }
    MusicVolume(0.1);
});
