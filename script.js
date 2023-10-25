	function BlacklistAccess() {
  const currentDate = new Date();
  const blacklistArray = JSON.parse(localStorage.getItem('Blacklist') || '[]');
  currentDate.setHours(currentDate.getHours() + 1);
  const blacklistEntry = {
    url: window.location.href,
    timeLimit: currentDate,
  };
  blacklistArray.push(blacklistEntry);
  localStorage.setItem('Blacklist', JSON.stringify(blacklistArray));
  showAlert();
}

function addClickCount() {
  let clickCount = parseInt(localStorage.getItem('ProtectionClickCount') || '0');
    const lastClickTime = new Date(localStorage.getItem('LastClickTime') || 0);
    const now = new Date();

    // 1분 지나면 클릭수 초기화
    if (now - lastClickTime > 1 * 60 * 1000) {
        clickCount = 0;
    }

    clickCount += 1;
    localStorage.setItem('LastClickTime', now.toString());
  console.log("Current click count:", clickCount);
  clickCount > 10 && (BlacklistAccess(), (clickCount = 0)); // 클릭수 제한
  localStorage.setItem('ProtectionClickCount', clickCount.toString());
}

function checkBlacklist() {
  showProtectionLog();
  const storedBlacklist = JSON.parse(localStorage.getItem('Blacklist') || '[]');
  let isCurrentUrlBlacklisted = false;
  const itemsToRemove = [];
  storedBlacklist.forEach((listItem, itemIndex) => {
    if (listItem.url === window.location.href) {
      const itemExpiryDate = new Date(listItem.timeLimit);
      const now = new Date();
      if(now < itemExpiryDate) {
        isCurrentUrlBlacklisted = true;
      } else {
        itemsToRemove.push(itemIndex);
      }
    }
  });
  
  for(let i = itemsToRemove.length - 1; i >= 0; i--) {
    storedBlacklist.splice(itemsToRemove[i], 1);
  }
  localStorage.setItem('Blacklist', JSON.stringify(storedBlacklist));

  isCurrentUrlBlacklisted && showAlert();
}

function showProtectionLog() {
  console.log('애드센스 무효 트래픽 감시 중\n무효 광고 클릭을 차단합니다.');
}

function showAlert() {
  alert('애드센스 무효 클릭 공격이 감지되었습니다.\nIP는 사이트 소유자에게 기록됩니다.\n무효 광고 클릭 반복 시 법적 책임을 질 수 있습니다.');
  window.location.replace('https://www.tistory.com/');
}

window.addEventListener('blur', () => {
  document.activeElement &&
    document.activeElement.src.includes('googleads') &&
    (addClickCount(),
    setTimeout(() => {
      document.activeElement.blur()
    }, 1000))
})

window.addEventListener('DOMContentLoaded', () => {
  checkBlacklist();
})
