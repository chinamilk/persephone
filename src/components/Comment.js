const $ = require("jquery");
window.jQuery = $;
import Cookies from 'js-cookie'

import Visitor from '../models/Visitor'
import DateTime from '../helpers/DateTime'

const MESSAGES = {
  disabled: "Enmmm..",
  error: "哎呀，出错了呢...呼叫一下叶子吧！",
  enabled: "Go!",
  sending: "Going.." 
}

export default class {
  constructor () {
    this.list = document.getElementById("commentsList")

    this.form = document.getElementById("newComment")

    this.postURL = this.form.action 

    this.nameInput = document.getElementsByName("fields[name]")[0]
    this.emailInput = document.getElementsByName("fields[email]")[0]
    this.parentInput = document.getElementsByName("fields[parent]")[0]
    this.messageArea = document.getElementsByName("fields[message]")[0]

    this.hintContainer = document.getElementById("commentHint")
    this.avatarImg = document.getElementById("visitorAvatar")

    this.submitBtn = document.getElementById("submitBtn")

    this.visitor = this.getVisitor()
    if ( this.visitor ) {
      this.initVisitorInfo()
    }

    this.disableBtn()

    this.messageArea.addEventListener("input", (e) => {
      if ( this.messageArea.value.length > 0 && this.submitBtn.disabled ) {
        this.enableBtn()
      } else if ( this.messageArea.value.length == 0 && !this.submitBtn.disabled ) {
        this.disableBtn()
      }
    })

    this.form.addEventListener("submit", (event) => {
      event.preventDefault()

      if ( !this.isValidate() ) {
        return;
      }

      if ( this.visitor ) {
        this.checkVisitorInfo() 
      } else {
        this.newVisitor()
      }

      this.disableBtn(true)
      const data = $(this.form).serialize()
      this.sendRequest(data)
    })

    $(".reply-btn").on("click", (event) => {
      let target = event.target.getAttribute("data-reply-to")
      this.reply(target)
    })

  }

  newVisitor () {
    this.visitor = new Visitor(this.nameInput.value, this.emailInput.value)
    this.visitor.save()
  }

  getVisitor () {
    let name = Cookies.get("name"),
        email = Cookies.get("email")

    if ( name ) {
      return new Visitor(name, email)
    }
  }

  checkVisitorInfo () {
    if ( this.visitor.name != this.nameInput.value ) {
      this.visitor.set_name(this.nameInput.value)
    }
    if ( this.visitor.email != this.emailInput.value ) {
      this.visitor.set_email(this.emailInput.value)
    }
  }

  initVisitorInfo () {
    this.nameInput.value = this.visitor.name
    this.emailInput.value = this.visitor.email || ""
    this.avatarImg.src = this.visitor.avatar
  }

  sendRequest (data) {
    $.ajax({
      url: this.postURL,
      type: "post",
      data: data,
      success: (res) => {
        this.disableBtn()
        this.addComment(res.fields)
        this.clearMessage()
      },
      error: () => {
        this.enableBtn()
        this.showError( MESSAGES["error"] )
      }
    })
  }

  showError (message) {
    this.hintContainer.innerText = message
    this.hintContainer.classList.add("comment__error")
  }

  clearError () {
    this.hintContainer.innerText = ""
    this.hintContainer.classList.remove("comment__error")
  }

  addComment (comment) {
    let content = this.parseComment(comment) 
    let target

    if ( this.replyTo ) {
      target = document.getElementById("comment-" + this.replyTo)
      target.append(content)
    } else {
      target = this.list
      target.insertBefore(content, target.childNodes[0])
    }
    this.scrollTo(content)
  }

  parseComment (comment) {
    let div = document.createElement("div")
    div.classList.add("comment", "comment_new", "clearfix")

    let content = '<div class="comment-main"><div class="comment-left"><div class="comment__avatar"><img src="https://www.gravatar.com/avatar/' + comment.email + '?d=mm&s=50"></div></div>'
    content += '<div class="comment-right"><div class="comment__meta">'
    content += '<span class="comment__author">' + comment.name + '</span>'

    let dt = new DateTime(comment.date * 1000)
    let dt_str = dt.parse("yy-mm-dd HH:MM")
    content += '<span class="comment__date">' + dt_str + '</span>'

    content += '</div>'
    content += '<div class="comment__content">' + comment.message + '</div></div>'

    div.innerHTML = content
    return div
  }

  isValidate () {
    if (     !this.nameInput.value
          || !this.emailInput.value
          || !this.messageArea.value
       ) {
      return false
    } else {
      return true
    }
  
  }

  clearMessage () {
    this.messageArea.innerText = ""
    this.messageArea.value = ""
    this.parentInput.value = ""
    this.hintContainer.innerText = ""
    this.clearError()
    this.replyTo = null
  }

  disableBtn (isInSubmit=false) {
    this.submitBtn.disabled = true
    if ( isInSubmit ) {
      this.submitBtn.innerHTML = MESSAGES["sending"]
    } else {
      this.submitBtn.innerHTML = MESSAGES["disabled"]
    }
  }

  enableBtn () {
    this.submitBtn.disabled = false
    this.submitBtn.innerHTML = MESSAGES["enabled"]
  }

  reply (index) {
    let authorEle = document.querySelector("#comment-" + index + " .comment__author")
    let author = authorEle.innerText
    this.hintContainer.innerText = "@" + author
    this.parentInput.value = index;
    this.replyTo = index
    this.messageArea.focus()
  }

  cancleReply () {
    this.parentInput.value = ""
    this.replyTo = nil
    this.hintContainer.innerText = ""
  }

  scrollTo (content) {
    let t = content.offsetTop
    $("html, body").animate({
      scrollTop: t
    }, 450)
  }
}
