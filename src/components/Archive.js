export default class Archive {
  constructor () {
    this.categories = document.getElementsByClassName("category")
    this.posts = document.getElementsByClassName("post__list_item")

    this.init()

    let _this = this
    for ( let category of this.categories ) {
      category.addEventListener("click", function() {
        if ( this != _this.current ) {
          _this.change(this)
        }
      })
    }
  }

  init() {
    let hash = window.location.hash.slice(1)
    this.current = this.categories[0]
    if ( hash != "" ) {
      for ( let category of this.categories ) {
        let escapedCat = encodeURI(category.getAttribute("data-category"))
        if ( hash == escapedCat ) {
          this.change(category)
          return
        }
      }
    }
  }

  filter(category) {
    for( let post of this.posts ) {
      let cat = post.getAttribute("data-category")
      if ( cat == category || category == "全部" ) {
        post.style.display = "block"
      } else {
        post.style.display = "none"
      }
    }
  }

  change(category) {
    this.current.classList.remove("active")
    this.current = category
    category.classList.add("active")
    this.filter(category.getAttribute("data-category"))
  }
}
