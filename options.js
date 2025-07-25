document.getElementById('save').addEventListener('click', () => {
  const webdavUrl = document.getElementById('webdavUrl').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  chrome.storage.local.set({ webdavUrl, username, password }, () => {
    alert('配置已保存');
  });
});

window.onload = () => {
  chrome.storage.local.get(['webdavUrl', 'username', 'password'], (result) => {
    document.getElementById('webdavUrl').value = result.webdavUrl || '';
    document.getElementById('username').value = result.username || '';
    document.getElementById('password').value = result.password || '';
  });
};
