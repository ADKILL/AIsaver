chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveFile') {
    const filename = request.filename;

    chrome.downloads.search({ filenameRegex: filename.split('/').pop(), exists: true }, (results) => {
      if (results.length > 0) {
        chrome.downloads.removeFile(results[0].id, () => {
          downloadFile(request.urlObject, filename);
        });
      } else {
        downloadFile(request.urlObject, filename);
      }
    });
  }

  if (request.action === 'uploadToWebdav') {
    uploadToWebdav(request.filename, request.content);
  }
});

function downloadFile(url, filename) {
  chrome.downloads.download({
    url: url,
    filename: filename,
    conflictAction: 'overwrite',
    saveAs: false
  }, (downloadId) => {
    if (chrome.runtime.lastError) {
      console.error('Download failed', chrome.runtime.lastError);
    }
  });
}

function uploadToWebdav(fileName, content) {
  chrome.storage.local.get(['webdavUrl', 'username', 'password'], (result) => {
    const { webdavUrl, username, password } = result;
    if (!webdavUrl) {
      console.log('WebDAV URL 未配置');
      return;
    }

    const fullUrl = `${webdavUrl}ChatGPT/${fileName}`;
    console.log('后台准备上传到：', fullUrl);

    fetch(fullUrl, {
      method: 'PUT',
      headers: {
        'Authorization': 'Basic ' + btoa(username + ':' + password),
        'Content-Type': 'text/markdown; charset=utf-8'
      },
      body: content
    }).then(res => {
      if (res.ok) console.log('后台 WebDAV 上传成功');
      else console.error('后台 WebDAV 上传失败', res.status, res.statusText);
    }).catch(err => console.error('后台 WebDAV 上传异常', err));
  });
}
