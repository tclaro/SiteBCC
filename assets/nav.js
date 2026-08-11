(function () {
  // Se a navegação já existe, apenas atualiza o chip ativo
  if (document.querySelector('.chip-nav')) {
    updateActiveChip();
    return;
  }

  // Definição dos itens de navegação
  var navItems = [
    // Páginas com conteúdo
    { href: 'coordenacao.html', label: 'Coordenação', title: 'Informações da Coordenação do BCC' },
    { href: 'grade-horaria.html', label: 'Grade Horária', title: 'Grade horária do curso' },
    { href: 'atividades-complementares.html', label: 'Atividades Complementares', title: 'Informações sobre atividades complementares' },
    { href: 'bcc-computer-club.html', label: 'BCC Computer Club', title: 'Monitoria e clube de computação' },
    { href: 'calendario-academico.html', label: 'Calendário Acadêmico', title: 'Calendário acadêmico do semestre' },
    { href: 'estagio.html', label: 'Estágio', title: 'Informações sobre estágio' },
    { href: 'saap.html', label: 'SAAP', title: 'Serviço de Acessibilidade e Apoio Psicopedagógico' },
    { href: 'quadro-docente.html', label: 'Quadro Docente', title: 'Professores do curso' },
    { href: 'representantes-turma.html', label: 'Representantes de Turma', title: 'Representantes de cada turma' },
    { href: 'https://bcc-senac.github.io/tccs/', label: 'TCC', title: 'Biblioteca digital de TCCs', external: true },
    { href: 'faq.html', label: 'FAQ', title: 'Perguntas frequentes' },
    // Páginas sem conteúdo (ocultas)
    { href: 'nucleo-docente-estruturante.html', label: 'NDE', title: 'Núcleo Docente Estruturante', hidden: true },
    { href: 'projetos-integradores.html', label: 'Projetos Integradores', title: 'Informações sobre projetos integradores', hidden: true }
  ];

  // Criar a nav
  var nav = document.createElement('nav');
  nav.className = 'chip-nav';
  nav.setAttribute('aria-label', 'Menu lateral');

  // Logo
  var logo = document.createElement('a');
  logo.href = 'index.html';
  logo.className = 'site-logo';
  logo.title = 'Voltar ao Início';
  var img = document.createElement('img');
  img.src = 'assets/bcc.png';
  img.alt = 'Logo BCC';
  logo.appendChild(img);
  nav.appendChild(logo);

  // Página atual
  var currentPage = location.pathname.split('/').pop() || 'index.html';

  // Criar chips
  for (var i = 0; i < navItems.length; i++) {
    var item = navItems[i];
    var a = document.createElement('a');
    a.href = item.href;
    a.className = 'chip';
    if (item.hidden) a.classList.add('chip-hidden');
    if (item.external) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
    a.title = item.title;
    a.textContent = item.label;
    if (item.href === currentPage) {
      a.classList.add('chip-active');
    }
    nav.appendChild(a);
  }

  // Inserir a nav no início do body
  document.body.insertBefore(nav, document.body.firstChild);

  function updateActiveChip() {
    var page = location.pathname.split('/').pop() || 'index.html';
    var chips = document.querySelectorAll('.chip');
    for (var j = 0; j < chips.length; j++) {
      chips[j].classList.remove('chip-active');
      if (chips[j].getAttribute('href') === page) {
        chips[j].classList.add('chip-active');
      }
    }
  }

  // Rolar para o topo ao carregar a página
  window.addEventListener('load', function () {
    window.scrollTo(0, 0);
  });
  window.scrollTo(0, 0);
})();
