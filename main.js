(() => {
  'use strict';

  const {notes, addTab, tabs, location} = window;
  const contentFromStorage = localStorage.getItem('shittyNotesContent');
  const shittyNotesContent = contentFromStorage ? JSON.parse(contentFromStorage) : {default: ''};
  let shittyNotesTab = localStorage.getItem('shittyNotesTab');
  let shittyNotesTabs = Object.keys(shittyNotesContent);
  let defaultHash = location.hash.slice(1);
  let currentTabFromHash = shittyNotesTabs.includes(defaultHash) ? defaultHash : null;
  let activeTab = currentTabFromHash || shittyNotesTab || shittyNotesTabs[0];
  let changed;

  const setActiveTab = tab => {
    activeTab = tab;
    location.hash = tab;
    window.document.title = `ShittyNotes - ${tab}`;
  };

  const renderApp = () => {
    tabs.innerHTML = shittyNotesTabs.reduce((result, tab) => (
      result + `<a href="#${tab}" class="${activeTab === tab ? 'active' : ''}">
                  <span>${tab}</span>
                  <strong>✕</strong>
                </a>`
    ), '');
    notes.value = shittyNotesContent[activeTab];
    setTimeout(() => notes.focus(), 0);
  };

  const saveChanges = e => {
    if (e) {
      localStorage.setItem('shittyNotesActive', 'false');
    }

    if (e || changed) {
      localStorage.setItem('shittyNotesTab', activeTab);
      localStorage.setItem('shittyNotesContent', JSON.stringify(shittyNotesContent));
      changed = false;
    }
  };

  tabs.onclick = e => {
    e.preventDefault();

    switch (e.target.nodeName) {
      case 'A':
        setActiveTab(e.target.firstElementChild.innerHTML);
        break;
      case 'SPAN':
        setActiveTab(e.target.innerHTML);
        break;
      case 'STRONG':
        if (shittyNotesTabs.length < 2) {
          break;
        }

        return;

        const tab = e.target.parentNode.innerText.slice(0, -2);
        delete shittyNotesContent[tab];
        shittyNotesTabs = shittyNotesTabs.filter(t => t !== tab);

        if (activeTab === tab) {
          setActiveTab(shittyNotesTabs[0]);
        }
        break;
    }

    renderApp();
  };

  addTab.onkeydown = e => {
    const value = e.target.value.trim();

    if (e.keyCode === 13 && value && !(value in shittyNotesContent)) {
      shittyNotesContent[value] = '';
      shittyNotesTabs.push(value);
      setActiveTab(value);
      e.target.value = '';
      renderApp();
      changed = true;
    }
  };

  notes.onkeydown = e => {
    shittyNotesContent[activeTab] = e.target.value;
    changed = true;
  }

  renderApp();
  setActiveTab(activeTab);
  setInterval(saveChanges, 5000);
  window.onbeforeunload = saveChanges;
  localStorage.setItem('shittyNotesActive', 'true');
})();