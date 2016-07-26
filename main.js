(({notes, addTab, tabs, location, document}) => {
  let shittyNotesContent = localStorage.getItem('shittyNotesContent');
  let shittyNotesTab = localStorage.getItem('shittyNotesTab');
  let activeTab;

  if (shittyNotesContent) {
    shittyNotesContent = JSON.parse(shittyNotesContent);
  } else {
    shittyNotesContent = {default: ''};
  }

  let shittyNotesTabs = Object.keys(shittyNotesContent);
  let currentTabFromHash = location.hash.slice(1);

  const renderApp = () => {
    tabs.innerHTML = shittyNotesTabs.reduce((result, tab) => (
      result + `<a href="#${tab}" class="${activeTab === tab ? 'active' : ''}">
                  <span>${tab}</span>
                  <strong>✕</strong>
                </a>`
    ), '');

    notes.value = shittyNotesContent[activeTab];
    notes.focus();
  };

  const setActiveTab = tab => {
    activeTab = tab;
    location.hash = tab;
    document.title = `ShittyNotes - ${tab}`;
    localStorage.setItem('shittyNotesTab', tab);
  };

  if (shittyNotesTabs.includes(currentTabFromHash)) {
    setActiveTab(currentTabFromHash);
  } else if (shittyNotesTab) {
    setActiveTab(shittyNotesTab);
  } else {
    setActiveTab(shittyNotesTabs[0]);
  }

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

        const tab = e.target.parentNode.innerText.slice(0, -2);
        delete shittyNotesContent[tab];
        shittyNotesTabs = shittyNotesTabs.filter(t => t !== tab);

        if (activeTab === tab) {
          setActiveTab(shittyNotesTabs[0]);
        }
        localStorage.setItem('shittyNotesContent', JSON.stringify(shittyNotesContent));
        break;
    }

    renderApp();
  };

  addTab.onkeydown = e => {
    const value = e.target.value.trim();

    if (e.keyCode === 13 && value && !(value in shittyNotesContent)) {
      shittyNotesContent[value] = '';
      localStorage.setItem('shittyNotesContent', JSON.stringify(shittyNotesContent));
      shittyNotesTabs.push(value);
      setActiveTab(value);
      renderApp();
      e.target.value = '';
    }
  };

  notes.onkeydown = notes.onchange = e => {
    shittyNotesContent[activeTab] = e.target.value;
    localStorage.setItem('shittyNotesContent', JSON.stringify(shittyNotesContent));
  };

  renderApp();
})(window);