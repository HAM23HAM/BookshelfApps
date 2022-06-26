const books = [];
const RENDER_EVENT = "render-book";

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function addBook() {
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor,bookYear, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function makeShelf(bookObject) {
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = bookObject.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = bookObject.author;

    const bookYear = document.createElement("p");
    bookYear.innerText = bookObject.year;

    const bookContainer = document.createElement("div");
    bookContainer.classList.add("inner")
    bookContainer.append(bookTitle, bookAuthor, bookYear);

    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(bookContainer);
    container.setAttribute("id", `book-${bookObject.id}`);

    if(bookObject.isCompleted){
        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");
        undoButton.addEventListener("click", function() {
            undoBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function() {
            removeBookFromCompleted(bookObject.id);
        });

        container.append(undoButton, trashButton);

    }else {
        const checkButton = document.createElement("button");
        checkButton.classList.add("check-button");
        checkButton.addEventListener("click", function() {
            addBookToCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function() {
            removeBookFromCompleted(bookObject.id);
        });

        container.append(checkButton, trashButton);
    }

    return container;
}

function findBook(bookId){
    for(bookItem of books){
        if(bookItem.id === bookId){
            return bookItem
        }
    }
    return null
}

function findBookIndex(bookId) {
    for(index in books){
        if(books[index].id === bookId){
            return index
        }
    }
    return -1
}

function addBookToCompleted(bookId) {

    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isCompleted = true;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    window.alert("Buku telah selesai dibaca");
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1) return;
    books.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    window.alert("Buku telah dihapus dari rak");
}

function undoBookFromCompleted(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isCompleted = false;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    window.alert("Buku dipindahkan belum selesai dibaca");
}

function saveData() {
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);

        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if(typeof(Storage) === undefined){
        alert("Browser yang anda gunakan tidak mendukung local storage");
        return false
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if(data !== null){
        for(book of data){
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function() {
    const submitForm = document.getElementById("form");
    submitForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addBook();
    });        

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function() {
    const incompletedShelf = document.getElementById("books");
    incompletedShelf.innerHTML = "";

    const completedShelf = document.getElementById("completed-books");
    completedShelf.innerHTML = "";

    for(bookItem of books){
        const bookElement = makeShelf(bookItem);
        if(bookItem.isCompleted == false)
            incompletedShelf.append(bookElement);
        else
            completedShelf.append(bookElement);
    }
});

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});