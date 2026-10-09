const search = document.getElementById('search');
  const tabs = [...document.querySelectorAll('.tab')];
  const cards = [...document.querySelectorAll('.card')];
  const groups = [...document.querySelectorAll('.group')];
  const count = document.getElementById('count');
  const empty = document.getElementById('empty');
  let activeFilter = 'all';

  function filterCards(){
    const term = search.value.trim().toLocaleLowerCase('pt-BR');
    let visible = 0;
    cards.forEach(card => {
      const category = card.dataset.category;
      const text = (card.innerText + ' ' + (card.dataset.search || '')).toLocaleLowerCase('pt-BR');
      const matchesFilter = activeFilter === 'all' || category === activeFilter || (activeFilter === 'IDG' && category === 'IDG') || (activeFilter === 'ISG' && category === 'ISG') || (activeFilter === 'faq' && category === 'faq');
      const show = matchesFilter && text.includes(term);
      card.style.display = show ? 'flex' : 'none';
      if(show) visible++;
    });
    groups.forEach(group => {
      const anyVisible = [...group.querySelectorAll('.card')].some(card => card.style.display !== 'none');
      group.style.display = anyVisible ? 'block' : 'none';
    });
    count.textContent = visible + (visible === 1 ? ' mensagem' : ' mensagens');
    empty.style.display = visible ? 'none' : 'block';
  }
  tabs.forEach(tab => tab.addEventListener('click', () => {
    activeFilter = tab.dataset.filter;
    tabs.forEach(item => item.classList.toggle('active', item === tab));
    filterCards();
  }));
  search.addEventListener('input', filterCards);
  function formatMessageForCopy(message) {
    return message
      .replace(/\r\n?/g, '\n')
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  document.querySelectorAll('.copy').forEach(button => button.addEventListener('click', async () => {
    const card = button.closest('.card');
    const rawMessage = card.querySelector('.message').innerText;
    const message = formatMessageForCopy(rawMessage);
    const original = button.innerText;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(message);
      } else {
        const area = document.createElement('textarea');
        area.value = message; area.style.position = 'fixed'; area.style.opacity = '0';
        document.body.appendChild(area); area.select();
        const ok = document.execCommand('copy'); area.remove();
        if (!ok) throw new Error('Falha ao copiar');
      }
      button.innerText = '✓ Copiado!';
      button.style.background = '#267342';
      setTimeout(() => { button.innerText = original; button.style.background = ''; }, 1600);
    } catch (error) {
      button.innerText = 'Não foi possível copiar';
      setTimeout(() => { button.innerText = original; }, 2000);
    }
  }));
  filterCards();
