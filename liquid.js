class Liquid {
  constructor(words, assets) {
    this.words = words;
    this.assets = assets;
    this.container = document.querySelector('.liquid');

    this.loadAssets();
    this.createLists();
    this.animationLogic();
  }

  createLists() {
    let createOutlineUl = document.createElement('ul');
    let containOutlineUl = document.createElement('div')
    createOutlineUl.classList.add('outline');
    containOutlineUl.classList.add('container-ul');

    for (let i = 0; i < this.words.length; i++) {
      let createLi = document.createElement('li');
      let createP = document.createElement('p');
      createLi.setAttribute("data-key", i)
      createP.textContent = this.words[i]
      createLi.appendChild(createP)
      createOutlineUl.appendChild(createLi)
    }

    let createFillUl = document.createElement('ul');
    let containFillUl = document.createElement('div')
    createFillUl.classList.add('active')
    containFillUl.classList.add('container-ul');
    containFillUl.classList.add('container-ul--clip');


    for (let i = 0; i < this.words.length; i++) {
      let createP = document.createElement('p')
      let createLi = document.createElement('li');
      createP.textContent = this.words[i]
      createLi.appendChild(createP)
      createFillUl.appendChild(createLi)
    }

    containOutlineUl.appendChild(createOutlineUl);
    containFillUl.appendChild(createFillUl);

    this.container.appendChild(containOutlineUl);
    this.container.appendChild(containFillUl);
  }

  loadAssets() {
    let div = document.createElement('div');
    div.classList.add('videos');

    for (let i = 0; i < this.assets.length; i++) {
      let asset = document.createElement('video');
      asset.muted = true;
      asset.loop = true;
      asset.setAttribute('type', 'video/mp4');
      asset.src = this.assets[i];
      div.appendChild(asset)
    }

    document.querySelector('body').prepend(div);
  }

  animationLogic() {
    let allVideos = document.querySelector('.videos');

    let amountOfPress = 0;
    let outlineTextUl = document.querySelector('ul');
    let fillTextUl = document.querySelector('ul.active');
    let currentUlPosition = 0;
    let timeoutAnimation;


    let listContainer = document.querySelectorAll('.container-ul');
    let textContainer = document.querySelector('.liquid');
    let moveText = 0;

    // when tapping / clicking on text
    let prevTapped = 0;


    // clicking on the text to trigger event
    outlineTextUl.querySelectorAll('li').forEach(cur => {
      cur.addEventListener('click', function () {
        scrollDOM(false, this.getAttribute('data-key'));

        // container scrolls down
        if (prevTapped - this.getAttribute('data-key') <= 0) {

          // remove the prev class
          outlineTextUl.classList.remove('move' + prevTapped);
          fillTextUl.classList.remove('move' + prevTapped);

          // add a new class to move the text down

          outlineTextUl.classList.add('move' + this.getAttribute('data-key'))
          fillTextUl.classList.add('move' + this.getAttribute('data-key'));

          moveTextOnEvent('left', 0, this.getAttribute('data-key'))
        } else {
          // container scrolls up
          outlineTextUl.classList.remove('move' + prevTapped);
          fillTextUl.classList.remove('move' + prevTapped);

          // add class to move text up
          if (this.getAttribute('data-key') != 0) {
            outlineTextUl.classList.add('move' + this.getAttribute('data-key'))
            fillTextUl.classList.add('move' + this.getAttribute('data-key'));
          }
          moveTextOnEvent('right', 0, this.getAttribute('data-key'))

        }
        prevTapped = this.getAttribute('data-key');
      })
    })

    window.addEventListener('keydown', function (ev) {

      if (ev.keyCode === 40) {
        // make down arrow not work if the element has the class move5
        if (!fillTextUl.className.includes('move5')) {
          scrollDOM('down');
        }
      } else if (ev.keyCode === 38) {
        // make top arrow key work only if the down arrow has been pressed
        if (fillTextUl.className.includes('move')) {
          scrollDOM('top');
        }
      }
    });

    /*
    takes in a direction on where to scroll text
    the second param is for when the text is clicked or tapped

    moves the text up or down adds a class and remove the previous class
    */

    function scrollDOM(dir, scrollTo) {
      if (dir == 'top') {
        outlineTextUl.classList.remove('move' + amountOfPress);
        fillTextUl.classList.remove('move' + amountOfPress);

        amountOfPress -= 1;

        if (amountOfPress !== 0) {
          outlineTextUl.classList.add('move' + amountOfPress);
          fillTextUl.classList.add('move' + amountOfPress);
        }

        moveDOM(amountOfPress)
        moveTextOnEvent('right', -1)
      } else if (dir == 'down') {
        if (amountOfPress !== 0) {
          outlineTextUl.classList.remove('move' + amountOfPress);
          fillTextUl.classList.remove('move' + amountOfPress);
        }
        amountOfPress += 1;
        moveDOM(amountOfPress)
        outlineTextUl.classList.add('move' + amountOfPress)
        fillTextUl.classList.add('move' + amountOfPress);
        moveTextOnEvent('left', 1)
      }
      // this is for when tap / click on the text
      if (scrollTo) {
        moveDOM(scrollTo)
      }
    }


    function moveDOM(toPos) {
      let currentVideo = allVideos.querySelectorAll('video')[toPos];
      currentVideo.play();
      let positionOfVideo = currentVideo.getBoundingClientRect().top;
      window.scrollBy({
        top: positionOfVideo,
        left: 0,
        behavior: 'smooth'
      });
    };


    // when clicking on the text move the container that holds the text a certain amount.
    //  The certain amount is calculated by the height of one of the images or videos
    // then multipied the attribute "key" from the element clicked on. the attribute
    // key was given in the html to be able to identify which element was clicked easier.

    // event are tap / click or arrow key move
    function moveTextOnEvent(animateDir, typeOfEvent, tapIndex) {
      listContainer.forEach(function (cur) {
        cur.classList.add('animate-skew-' + animateDir);

        timeoutAnimation = window.setTimeout(function () {
          cur.classList.remove('animate-skew-' + animateDir);
        }, 300)
      })

      // get one of the video elements the get the height that is computed
      // replace px with empty string, make sure it is a number
      // if is is clicked multiply the amount of height of element by the "key"
      // otherwise just add or subtract the height to the variable
      // to tell how much the move the container of the text by

      if (typeOfEvent === 0) {
        let moveAmount = parseInt(window.getComputedStyle(allVideos.querySelector('video'), null)
          .getPropertyValue('height')
          .replace('px', '')) * tapIndex;
        moveText = moveAmount;
        textContainer.style.transform = 'translate3d(0, ' + moveText + 'px, 0)';

      } else if (typeOfEvent !== 0) {
        moveText += parseInt(window.getComputedStyle(allVideos.querySelector('video'), null)
          .getPropertyValue('height')
          .replace('px', '')) * typeOfEvent;
        textContainer.style.transform = 'translate3d(0, ' + moveText + 'px, 0)';
      }
    }
  }
}


