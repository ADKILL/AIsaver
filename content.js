function parseChatToMarkdown() {
  const chats = document.querySelectorAll('.chat-message, .markdown');
  let md = '# ChatGPT 对话\n\n';

  chats.forEach(div => {
    md += div.innerText + '\n\n';
  });

  return md;
}

function generateFileName() {
  let title = document.title.replace(' - ChatGPT', '').trim();
  title = title.replace(/[\\/:*?"<>|]/g, ' ');
  return title + '.md';
}

function save() {
  const md = parseChatToMarkdown();
  const fileName = generateFileName();

  const blob = new Blob([md], { type: 'text/markdown; charset=utf-8' });
  const urlObject = URL.createObjectURL(blob);

  chrome.runtime.sendMessage({
    action: 'saveFile',
    urlObject,
    filename: 'ChatGPT/' + fileName
  });

  chrome.runtime.sendMessage({
    action: 'uploadToWebdav',
    filename: fileName,
    content: md
  });
}

setTimeout(save, 5000);
