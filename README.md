# _liquid_

#### _This is a css / JavaScript library, 07.19.2018_

#### By _**colorlessenergy**_

## Description

_This library has been created because I made a animation and wanted other people to make the same animations easily._

## Setup/Installation Requirements

* _Clone repository_
* _Navigate to the cloned repository_
* _open index.html in web browser of choice to see a example of a animation_

## Known Bugs

_when tapping on the text and then trying to use arrow keys to move DOM doesnt move properly.

## Support and contact details

_If you run into any issues or have questions, ideas or concerns contact me at brianmunozdev@gmail.com_

## Technologies Used

_HTML_
_CSS_
_JavaScript_


# DOCS

to get it working all you need to is link the _liquid.css_ and _liquid.js_ file to your index.html

In the HTML

```html
<div class="liquid"></div>
````

now all you have to do is make a new Instance of the Liquid object

```javascript
new Liquid(listOfNames, ListOfVideos)

// example you could do
let newLiquid = new Liquid(['Goku', 'gohan', 'vegeta', 'trunks', 'piccolo', 'krillen'], ['assets/goku.mp4', 'assets/gohan.mp4', 'assets/vegeta.mp4', 'assets/trunks.mp4', 'assets/piccolo.mp4', 'assets/krillen.mp4'])
````
when making a constructor all you have to do is give a array of names and an array of video paths.

you can see a example here [dbz-visual](https://colorlessenergy.github.io/liquid/)
