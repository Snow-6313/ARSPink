// Home page team loader: fills developer cards from Discord user IDs.
(function() {
  var cards = document.querySelectorAll('.js-team-card');
  if (!cards.length) return;

  function byClass(root, cls) {
    return root.querySelector('.' + cls);
  }

  function setFallback(card) {
    var fallbackName = card.getAttribute('data-fallback-name') || 'Developer';
    var role = card.getAttribute('data-role') || 'Developer';
    var avatar = byClass(card, 'js-team-avatar');
    var name = byClass(card, 'js-team-name');
    var roleEl = byClass(card, 'js-team-role');

    name.textContent = fallbackName;
    roleEl.textContent = role;
    avatar.textContent = fallbackName.charAt(0).toUpperCase();
  }

  function getAvatarUrl(user) {
    if (!user || !user.id) return '';
    if (user.avatar) {
      var ext = user.avatar.indexOf('a_') === 0 ? 'gif' : 'png';
      return 'https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.' + ext + '?size=128';
    }

    // Default avatar if user has no custom avatar.
    var disc = Number(user.discriminator || 0);
    var index = disc % 5;
    return 'https://cdn.discordapp.com/embed/avatars/' + index + '.png';
  }

  function fetchUserFromJapi(discordId) {
    return fetch('https://japi.rest/discord/v1/user/' + encodeURIComponent(discordId), {
      headers: { Accept: 'application/json' }
    }).then(function(res) {
      if (!res.ok) throw new Error('JAPI lookup failed');
      return res.json();
    }).then(function(json) {
      var data = json && json.data ? json.data : null;
      if (!data) return null;
      return {
        id: data.id,
        username: data.username,
        global_name: data.global_name,
        discriminator: data.discriminator,
        avatar: data.avatar,
        avatarURL: data.avatarURL
      };
    });
  }

  function fetchUserFromLanyard(discordId) {
    return fetch('https://api.lanyard.rest/v1/users/' + encodeURIComponent(discordId), {
      headers: { Accept: 'application/json' }
    }).then(function(res) {
      if (!res.ok) throw new Error('Lanyard lookup failed');
      return res.json();
    }).then(function(json) {
      var data = json && json.data ? json.data : null;
      return data && data.discord_user ? data.discord_user : null;
    });
  }

  function loadCard(card) {
    setFallback(card);

    var discordId = (card.getAttribute('data-discord-id') || '').trim();
    if (!discordId) return;

    var discordLink = byClass(card, 'js-team-discord');
    discordLink.href = 'https://discord.com/users/' + encodeURIComponent(discordId);

    fetchUserFromJapi(discordId).catch(function() {
      return fetchUserFromLanyard(discordId);
    }).then(function(user) {
      if (!user) return;

      var avatar = byClass(card, 'js-team-avatar');
      var name = byClass(card, 'js-team-name');

      name.textContent = user.global_name || user.username || name.textContent;

      var avatarUrl = user.avatarURL || getAvatarUrl(user);
      if (avatarUrl) {
        avatar.style.backgroundImage = 'url("' + avatarUrl + '")';
        avatar.classList.add('has-image');
        avatar.textContent = '';
      }
    }).catch(function() {
      // Keep fallback values when lookup fails.
    });
  }

  Array.prototype.forEach.call(cards, loadCard);
})();
