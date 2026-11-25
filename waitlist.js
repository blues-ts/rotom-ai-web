// Android waitlist.
// 1. On Android, App Store buttons point to the waitlist form instead.
// 2. The form posts to /api/waitlist (Cloudflare Worker, see worker/src/waitlist.js)
//    and shows the result inline. Without JS the form still posts normally.
(function () {
  var lang = document.documentElement.lang;
  var T = {
    en: { home: "/", join: "Join the Android waitlist", short: "Android waitlist", sending: "Sending…", error: "Something went wrong. Please try again." },
    es: { home: "/es/", join: "Únete a la lista de Android", short: "Lista de Android", sending: "Enviando…", error: "Algo salió mal. Inténtalo de nuevo." },
    "pt-BR": { home: "/pt-br/", join: "Entrar na lista do Android", short: "Lista do Android", sending: "Enviando…", error: "Algo deu errado. Tente novamente." }
  }[lang] || null;
  if (!T) return;

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    if (/Android/i.test(navigator.userAgent)) {
      var links = document.querySelectorAll('a[href*="apps.apple.com"]');
      for (var i = 0; i < links.length; i++) {
        var a = links[i];
        a.href = T.home + "#android";
        a.textContent = a.classList.contains("btn-small") ? T.short : T.join;
      }
    }

    var forms = document.querySelectorAll("form.waitlist");
    for (var j = 0; j < forms.length; j++) wire(forms[j]);
  });

  function wire(form) {
    var box = form.closest(".android");
    var msg = box.querySelector(".waitlist-msg");
    var btn = form.querySelector("button");
    var label = btn.textContent;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      btn.disabled = true;
      btn.textContent = T.sending;
      msg.textContent = "";
      msg.classList.remove("is-error");

      fetch(form.action, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          msg.textContent = res.message;
          if (res.ok) form.hidden = true;
          else msg.classList.add("is-error");
        })
        .catch(function () {
          msg.textContent = T.error;
          msg.classList.add("is-error");
        })
        .then(function () {
          btn.disabled = false;
          btn.textContent = label;
        });
    });
  }
})();
