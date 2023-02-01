async function copyLobbyLink() {
  const steamId = document.querySelector('#steam-id').value;
  if (steamId) {
    const steamLink = await fetchSteamLink(steamId);
    if (steamLink) {
      copyTextToClipboard(steamLink);
      return;
    }
    return;
  }
  alert('No steam ID informed');
}

async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Lobby URL copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

async function fetchSteamLink(steamId) {
  const body = {
    "steamId": steamId
  };
  const headers = new Headers({"Content-Type": "application/json"});
  const requestOptions = {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(body),
    headers: headers
  };
  try {
    const response = await fetch('http://localhost:8081/get-steam-link', requestOptions);
    const body = await response.json();
    if (body.status === 200) {
      return body.message;
    }
    if (body.error) {
      alert(body.error);
    }
    return false;
  } catch (error) {
    alert(error);
    console.log(error);
  }
}

window.onload = () => {
  const fightButton = document.querySelector('#fight');
  fightButton.addEventListener('click', copyLobbyLink);
}