(function () {
  // Usar delegação de eventos para funcionar com conteúdo dinâmico
  document.addEventListener('click', function (e) {
    var button = e.target.closest('.faq-question');
    if (!button) return;
    
    e.preventDefault();
    
    var answer = button.nextElementSibling;
    if (!answer) return;
    
    var icon = button.querySelector('.faq-icon');

    // Fechar todas as respostas abertas
    document.querySelectorAll('.faq-answer.active').forEach(function (openAnswer) {
      if (openAnswer !== answer) {
        openAnswer.classList.remove('active');
        var siblingButton = openAnswer.previousElementSibling;
        if (siblingButton) {
          var siblingIcon = siblingButton.querySelector('.faq-icon');
          if (siblingIcon) siblingIcon.textContent = '+';
        }
      }
    });
    
    // Alternar a resposta clicada
    answer.classList.toggle('active');
    if (icon) {
      icon.textContent = answer.classList.contains('active') ? '−' : '+';
    }
  });

  // Busca e filtro
  document.addEventListener('input', function (e) {
    if (e.target.id !== 'faq-search-input') return;
    
    var searchInput = e.target;
    var clearBtn = document.getElementById('faq-search-clear');
    var container = document.querySelector('.faq-container');

    if (!container) return;
    
    var term = searchInput.value.trim().toLowerCase();
    if (clearBtn) clearBtn.hidden = term.length === 0;

    var items = container.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var title = item.querySelector('.faq-title');
      var body = item.querySelector('.faq-answer');
      if (!title || !body) return;
      
      var titleText = title.textContent.toLowerCase();
      var bodyText = body.textContent.toLowerCase();
      item.style.display = (titleText.indexOf(term) !== -1 || bodyText.indexOf(term) !== -1) ? '' : 'none';
    });
  });

  // Limpar busca
  document.addEventListener('click', function (e) {
    if (e.target.id !== 'faq-search-clear') return;
    
    var searchInput = document.getElementById('faq-search-input');
    var clearBtn = e.target;
    var container = document.querySelector('.faq-container');

    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.hidden = true;
    if (container) {
      container.querySelectorAll('.faq-item').forEach(function (item) {
        item.style.display = '';
      });
    }
    if (searchInput) searchInput.focus();
  });
})();

