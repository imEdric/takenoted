let notes = JSON.parse(localStorage.getItem('notes')) || [];
let trash = JSON.parse(localStorage.getItem('trash')) || [];
const password = "0000";

document.addEventListener("DOMContentLoaded", function() {
    checkLogin();
});

function checkLogin() {
    const modal = document.getElementById('login-modal');
    if (!localStorage.getItem('loggedIn')) {
        modal.style.display = 'flex';
    }
}

function checkPassword() {
    const inputPassword = document.getElementById('password').value;
    if (inputPassword === password) {
        localStorage.setItem('loggedIn', true);
        document.getElementById('login-modal').style.display = 'none';
        showCategory('work'); // Hiển thị công việc mặc định
    } else {
        alert('Incorrect Password');
    }
}

function saveNote() {
    const title = document.getElementById('note-title').value;
    const category = document.getElementById('note-category').value;
    const content = document.getElementById('note-content').value;
    const date = new Date();
    const note = {
        title,
        category,
        content,
        date: date.toLocaleString()
    };
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes(category);
    clearForm();
}

function showCategory(category) {
    const workContainer = document.getElementById('work-container');
    const codeContainer = document.getElementById('code-container');
    const trashContainer = document.getElementById('trash-container');
    const noteContainer = document.querySelector('.note-container');
    noteContainer.style.display = 'flex';

    if (category === 'work') {
        workContainer.style.display = 'flex';
        codeContainer.style.display = 'none';
        trashContainer.style.display = 'none';
    } else if (category === 'code') {
        codeContainer.style.display = 'flex';
        workContainer.style.display = 'none';
        trashContainer.style.display = 'none';
    }
    displayNotes(category);
}

function showTrash() {
    const workContainer = document.getElementById('work-container');
    const codeContainer = document.getElementById('code-container');
    const trashContainer = document.getElementById('trash-container');
    const noteContainer = document.querySelector('.note-container');
    noteContainer.style.display = 'flex';

    workContainer.style.display = 'none';
    codeContainer.style.display = 'none';
    trashContainer.style.display = 'flex';

    displayTrash();
}

function displayNotes(category) {
    const workContainer = document.getElementById('work-container');
    const codeContainer = document.getElementById('code-container');
    workContainer.innerHTML = '';
    codeContainer.innerHTML = '';

    notes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <button class="delete-btn" onclick="deleteNote(${index})">
                <img src="trash-icon.png" alt="Delete">
            </button>
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <small>${note.category} - ${note.date}</small>
        `;

        if (note.category === 'work' && category === 'work') {
            workContainer.appendChild(noteElement);
        } else if (note.category === 'code' && category === 'code') {
            codeContainer.appendChild(noteElement);
        }
    });
}

function displayTrash() {
    const trashContainer = document.getElementById('trash-container');
    trashContainer.innerHTML = '';

    trash.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <button class="restore-btn" onclick="restoreNote(${index})">
                <img src="restore-icon.png" alt="Restore">
            </button>
            <button class="permanent-delete-btn" onclick="permanentDeleteNote(${index})">
                <img src="trash-icon.png" alt="Delete">
            </button>
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <small>${note.category} - ${note.date}</small>
        `;
        trashContainer.appendChild(noteElement);
    });
}

function deleteNote(index) {
    const note = notes.splice(index, 1)[0];
    trash.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('trash', JSON.stringify(trash));
    const currentCategory = document.getElementById('work-container').style.display === 'flex' ? 'work' : 'code';
    displayNotes(currentCategory);
}

function restoreNote(index) {
    const note = trash.splice(index, 1)[0];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('trash', JSON.stringify(trash));
    displayTrash();
}

function permanentDeleteNote(index) {
    trash.splice(index, 1);
    localStorage.setItem('trash', JSON.stringify(trash));
    displayTrash();
}

function clearForm() {
    document.getElementById('note-title').value = '';
    document.getElementById('note-category').value = 'work';
    document.getElementById('note-content').value = '';
}
