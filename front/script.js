// Frontend medvetet gjort slarvigt för att påminna mig själv
// om alla problem som uppstår kan uppstå då
const BASE_URL = "http://localhost:3000"
let signupOrLogin = ''
window.onload = function() {
    fetch(BASE_URL + '/api/user/validatetoken', {
        method: "GET",
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) loggedIn(data.username)
    })
    signupBtn.addEventListener("click", signUp)
    loginBtn.addEventListener("click", login)
    sendBtn.addEventListener("click", send)
    logoutBtn.addEventListener("click", logout)
    addNoteBtn.addEventListener("click", addNote)
    getNotes.addEventListener("click", getNoteList)
    titleSearach.addEventListener("keydown", e => {if(e.key === "Enter")getNotes.click()})
}
const signupBtn = document.querySelector("#signup-btn")
const loginBtn = document.querySelector("#login-btn")
const logoutBtn = document.querySelector("#logout-btn")
const sendBtn = document.querySelector("#send-btn")
const loginForm = document.querySelector("#login-form")
const formHeader = document.querySelector("#form-header")
const logMsg = document.querySelector("#log-msg")
const addMsg = document.querySelector("#add-msg")
const username = document.querySelector("#username")
const password = document.querySelector("#password")
const content = document.querySelector("#content")
const addNoteBtn = document.querySelector("#add-note")
const title = document.querySelector("#title")
const text = document.querySelector("#text")
const getNotes = document.querySelector("#get-notes")
const allNotes = document.querySelector("#all-notes")
const titleSearach = document.querySelector("#title-search")

function signUp() {
    loginForm.classList.remove("hide")
    formHeader.textContent = "Signup"
    signupOrLogin = "signup"
    logMsg.textContent = ''
}
function login() {
    loginForm.classList.remove("hide")
    formHeader.textContent = "Login"
    signupOrLogin = "login"
    logMsg.textContent = ''
}

function logout() {
    sessionStorage.token = ''
    allNotes.innerHTML = ''
    title.value = ''
    text.value = ''
    titleSearach.value = ''
    titleSearach.setAttribute("placeholder", '')
    loggedOut()
}
function loggedOut() {
    logoutBtn.classList.add("hide")
    logoutBtn.textContent = ''
    loginBtn.classList.remove("hide")
    signupBtn.classList.remove("hide")
    loginForm.classList.add("hide")
    content.classList.add("hide")

}

function loggedIn(name) {
    logoutBtn.classList.remove("hide")
    logoutBtn.textContent = `Hi, ${name}. Click here to log out`
    loginBtn.classList.add("hide")
    signupBtn.classList.add("hide")
    loginForm.classList.add("hide")
    content.classList.remove("hide")
    getNoteList()
}

function send() {
    fetch(BASE_URL + '/api/user/' + signupOrLogin, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username: username.value,password:password.value})
    })
    .then(response => response.json())
    .then(data => {
        if(signupOrLogin === 'signup') {
            logMsg.textContent = data.msg
            if(data.success === true) login()
        } else {
            logMsg.textContent = data.msg
            if(data.success) {
                sessionStorage.token = data.token
                fetch(BASE_URL + '/api/user/validatetoken', {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${sessionStorage.token}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if(data.success) loggedIn(data.username)
                })
            }
        }
    })
}

function addNote() {
    fetch(BASE_URL + '/api/notes/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.token}`
        },
        body: JSON.stringify({title: title.value,text:text.value})
    })
    .then(response => response.json())
    .then(data => {
        addMsg.textContent = data.msg
        if(data.success) {
            title.value = ''
            text.value = ''
            getNoteList()
        }
    })

}

function getNoteList() {
    allNotes.innerHTML = ''
    addMsg.textContent = ''
    let searchString = ''
    if(titleSearach.value !== '') searchString = "search?searchstring=" + titleSearach.value
    titleSearach.setAttribute("placeholder", titleSearach.value)
    titleSearach.value = ''
    fetch(BASE_URL + '/api/notes/' + searchString, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        for(let i = 0; i < data.notes.length; i++) {
            const article = document.createElement("article")
            const title = document.createElement("h3")
            const text = document.createElement("p")
            const created = document.createElement("p")
            const changed = document.createElement("p")
            const changeBtn = document.createElement("button")
            changeBtn.addEventListener("click", (e) => changeNote(article, data.notes[i].id))
            const delBtn = document.createElement("button")
            delBtn.addEventListener("click", (e) => deleteNote(data.notes[i].id))
            title.textContent = data.notes[i].title
            text.textContent = data.notes[i].text
            created.textContent = new Date(data.notes[i].createdAt).toLocaleString()
            changed.textContent = new Date(data.notes[i].modifiedAt).toLocaleString()
            changeBtn.textContent = "Edit"
            delBtn.textContent = "Delete"
            article.append(title,text,created,changed,changeBtn,delBtn)
            allNotes.append(article)
        }
    })

}
function changeNote(article, id) {
    const title = article.childNodes[0]
    const text = article.childNodes[1]
    const editBtn = article.childNodes[4]
    const delBtn = article.childNodes[5]
    
    const oldTitle = title.textContent
    const oldText = text.textContent
    const titleInput = document.createElement("input")
    const textInput = document.createElement("input")
    const confirmBtn = document.createElement("button")
    const cancelBtn = document.createElement("button")
    titleInput.value = oldTitle
    textInput.value = oldText
    confirmBtn.textContent = "Confirm"
    cancelBtn.textContent = "Cancel"
    cancelBtn.addEventListener("click", cancel)
    confirmBtn.addEventListener("click", confirmEdit)
    article.replaceChild(titleInput, title)
    article.replaceChild(textInput, text)
    article.replaceChild(confirmBtn, editBtn)
    article.replaceChild(cancelBtn, delBtn)
    function cancel() {
        article.replaceChild(title, titleInput)
        article.replaceChild(text, textInput)
        article.replaceChild(editBtn, confirmBtn)
        article.replaceChild(delBtn, cancelBtn)
    }
    function confirmEdit() {
        title.textContent = titleInput.value
        text.textContent = textInput.value
        fetch(BASE_URL + '/api/notes/', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.token}`
            },
            body: JSON.stringify({id, title:title.textContent, text: text.textContent})
        })
        .then(response => response.json())
        .then(data => {
            cancel()
            getNoteList()
        })
    }
}

function deleteNote(id) {
    fetch(BASE_URL + '/api/notes/del/' + id, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${sessionStorage.token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        getNoteList()
    })
}