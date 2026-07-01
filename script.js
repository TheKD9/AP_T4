
const noteTitle = document.getElementById('note-title');
const noteBody = document.getElementById('note-body');
const saveBtn = document.getElementById('save-btn');
const notesContainer = document.getElementById('notes-container');
const searchBar = document.getElementById('search-bar');
const gridViewBtn = document.getElementById('grid-view-btn');
const listViewBtn = document.getElementById('list-view-btn');
const colorDots = document.querySelectorAll('.color-dot');


let notes = JSON.parse(localStorage.getItem('notebook_pro_data')) || [];
let selectedCategory = 'personal'; 
let currentView = 'grid'; 

renderNotes();

colorDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
        colorDots.forEach(d => d.classList.remove('active'));
        e.target.classList.add('active');
        selectedCategory = e.target.getAttribute('data-color');
    });
});

saveBtn.addEventListener('click', () => {
    const titleText = noteTitle.value.trim();
    const bodyText = noteBody.value.trim();

    if (!titleText && !bodyText) {
        alert('Please fill out at least a title or a note description.');
        return;
    }

    const newNote = {
        id: Date.now(),
        title: titleText || 'Untitled Note',
        body: bodyText,
        category: selectedCategory,
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    };

    notes.unshift(newNote);
    syncStorage();
    renderNotes();

    noteTitle.value = '';
    noteBody.value = '';
});

searchBar.addEventListener('input', () => {
    renderNotes();
});

gridViewBtn.addEventListener('click', () => {
    currentView = 'grid';
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
    notesContainer.className = 'notes-grid';
});

listViewBtn.addEventListener('click', () => {
    currentView = 'list';
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
    notesContainer.className = 'notes-list';
});


function renderNotes() {
    notesContainer.innerHTML = '';
    const query = searchBar.value.toLowerCase().trim();


    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.body.toLowerCase().includes(query)
    );

    if (filteredNotes.length === 0) {
        notesContainer.innerHTML = `
            <div class="empty-state">
                <p>${query ? 'No matching notes found.' : 'Your workspace is empty. Create your first note above!'}</p>
            </div>`;
        return;
    }

    filteredNotes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = `note-card ${note.category}`;
        
        noteCard.innerHTML = `
            <div class="note-header">
                <h2>${escapeHTML(note.title)}</h2>
                <button class="delete-action-btn" onclick="deleteNote(${note.id})" title="Delete Note">✕</button>
            </div>
            <p>${escapeHTML(note.body)}</p>
            <div class="note-footer">
                <span class="date">${note.date}</span>
                <span class="note-tag">${note.category}</span>
            </div>
        `;
        notesContainer.appendChild(noteCard);
    });
}


function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    syncStorage();
    renderNotes();
}

function syncStorage() {
    localStorage.setItem('notebook_pro_data', JSON.stringify(notes));
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
