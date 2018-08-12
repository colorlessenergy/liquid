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

    let amountOfPressesDown = 0;
    let outlineTextUl = document.querySelector('.outline');
    let fillTextUl = document.querySelector('ul.active');
    let amountOfPressesTop = 0;
    let currentUlPosition = 0;
    let timeoutAnimation;

    let moveText = 0;
    let listContainer = document.querySelectorAll('.container-ul');
    let textContainer = document.querySelector('.liquid');

    // when tapping / clicking on text
    let prevTapped = 0;


    // clicking on the text to trigger event
    outlineTextUl.querySelectorAll('li').forEach(cur => {
      cur.addEventListener('click', function () {
        scrollDOM(false, this.getAttribute('data-key'));


        // container scrolls down
        if (prevTapped - this.getAttribute('data-key') <= 0) {
          outlineTextUl.classList.add('move' + this.getAttribute('data-key'))
          fillTextUl.classList.add('move' + this.getAttribute('data-key'));

          moveTextOnEvent('left', 0, this.getAttribute('data-key'))
        } else {
          // container scrolls up
          let ulClass = outlineTextUl.className.split(' ').pop();
          outlineTextUl.classList.remove(ulClass)
          let ulActiveClass = fillTextUl.className.split(' ').pop();
          fillTextUl.classList.remove(ulActiveClass)

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


    function scrollDOM(dir, scrollTo) {
      let condition;
      let increment;
      if (dir == 'top') {
        amountOfPressesTop += 1;
        let ulClass = outlineTextUl.className.split(' ').pop();
        outlineTextUl.classList.remove(ulClass)
        let ulActiveClass = fillTextUl.className.split(' ').pop();
        fillTextUl.classList.remove(ulActiveClass)
        condition = amountOfPressesDown !== 0;
        increment = -1;

      } else if (dir == 'down') {
        condition = (amountOfPressesDown + 1) !== allVideos.querySelectorAll('video').length + 1;
        increment = 1;
      } else {
        condition = dir;
      }

      if (condition) {
        amountOfPressesDown += increment;
        moveDOM(amountOfPressesDown)

        if (dir == 'down') {
          outlineTextUl.classList.add('move' + amountOfPressesDown)
          fillTextUl.classList.add('move' + amountOfPressesDown);

          moveTextOnEvent('left', 1)
        } else if (dir == 'top') {
          moveTextOnEvent('right', -1)
        }
      } else {
        // this is for when tap / click on the text
        if (scrollTo) {
          moveDOM(scrollTo)
        }
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


