import { TweenMax, TimelineLite, Sine} from 'gsap/TweenMax'
import imagesLoaded from 'imagesloaded'

export default class {
  constructor () {
    this.list = document.getElementsByClassName("post__entry")
    this.img = document.getElementById("bgFigure")
    this.current = null

    for ( let item of this.list) {
      let img = new Image()
      img.src = item.getAttribute("data-figure")
      
      item.addEventListener("mouseenter", (event) => {
        let current = event.target;
        if ( this.current != current ) {
          this.show(current);
        }
      })

      item.addEventListener("mouseleave", (event) => {
        this.hide();
      })
    }
  }

  show (target) {
    this.current = target
    this.img.src = this.current.getAttribute("data-figure")
    imagesLoaded( this.img, (instance) => {
      let timeline = new TimelineLite();
      timeline.add( TweenMax.to( this.img, 0.3, {
        opacity: 0.2
      }));
      timeline.add( TweenMax.to( this.img, 100, {
        transform: "scale(1.5, 1.5)"
      }));
    })
  }

  hide () {
    TweenMax.to( this.img, 0.15, {
      opacity: 0
    })
    this.img.style.transform = "scale(1, 1)"
  }
}
