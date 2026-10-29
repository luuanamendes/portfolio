/* ==========================================================================
   Luana Mendes · portfólio
   1. Texto digitando na capa
   2. Botão que copia o e-mail
   3. Entrada suave dos blocos ao rolar a página

   Os textos que mudam com o idioma vêm do HTML (atributos data-*),
   então o mesmo script serve para index.html e portfolio-en.html.
   ========================================================================== */

(function () {
  'use strict';

  var EMAIL = 'hello@luanamendes.com';

  var prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* 1. Texto digitando na capa
     O primeiro termo já vem escrito no HTML; a animação começa depois de 2s. */
  function initTyper() {
    var target = document.getElementById('typer-text');
    if (!target || prefersReducedMotion) return;

    // ex.: data-words="desenvolvedora web|diretora criativa|social media"
    var TYPER_WORDS = (target.getAttribute('data-words') || target.textContent).split('|');

    var wordIndex = 0;
    var charIndex = TYPER_WORDS[0].length;
    var deleting = false;

    function tick() {
      var word = TYPER_WORDS[wordIndex];

      if (!deleting) {
        if (charIndex < word.length) {
          charIndex++;
          target.textContent = word.slice(0, charIndex);
          return setTimeout(tick, 85);
        }
        deleting = true;
        return setTimeout(tick, 1800);
      }

      if (charIndex > 0) {
        charIndex--;
        target.textContent = word.slice(0, charIndex);
        return setTimeout(tick, 45);
      }

      deleting = false;
      wordIndex = (wordIndex + 1) % TYPER_WORDS.length;
      setTimeout(tick, 250);
    }

    setTimeout(tick, 2200);
  }


  /* 2. Botão que copia o e-mail */
  function initCopyEmail() {
    var button = document.getElementById('copy-email');
    var label = document.getElementById('copy-email-text');
    var toast = document.getElementById('toast');
    if (!button || !toast) return;

    var hideTimer;
    var copiedMessage = button.getAttribute('data-copied') || 'e-mail copiado ✓';
    var selectedMessage = button.getAttribute('data-selected') || 'e-mail selecionado, é só copiar';

    function showToast(message) {
      toast.textContent = message;
      toast.hidden = false;
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () { toast.hidden = true; }, 2200);
    }

    // plano B: seleciona o texto para a pessoa copiar manualmente
    function selectEmail() {
      var range = document.createRange();
      range.selectNodeContents(label);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      showToast(selectedMessage);
    }

    button.addEventListener('click', function () {
      try {
        navigator.clipboard.writeText(EMAIL).then(
          function () { showToast(copiedMessage); },
          selectEmail
        );
      } catch (error) {
        selectEmail();
      }
    });
  }


  /* 3. Entrada suave dos blocos ao rolar a página
     Só anima o que está abaixo da primeira tela, então nada some no carregamento. */
  function initReveal() {
    if (!('IntersectionObserver' in window) || prefersReducedMotion) return;

    var items = document.querySelectorAll(
      '.card, .service, .stat, .posts__item, .about__card, .mediakit__card, .contact__card, .taped'
    );
    var viewportHeight = window.innerHeight;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (item) {
      if (item.getBoundingClientRect().top > viewportHeight) {
        item.classList.add('reveal');
        observer.observe(item);
      }
    });
  }


  initTyper();
  initCopyEmail();
  initReveal();
})();
