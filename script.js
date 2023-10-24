function BlacklistAccess() {
  const currentDate = new Date();
  const blacklistArray = JSON.parse(localStorage.getItem('Blacklist') || '[]')
  currentDate.setHours(currentDate.getHours() + 1)
  const blacklistEntry = {
    url: window.location.href,
    timeLimit: currentDate,
  }
  blacklistArray.push(blacklistEntry)
  localStorage.setItem('Blacklist', JSON.stringify(blacklistArray))
  showAlert()
}

function addClickCount() {
  let clickCount = parseInt(localStorage.getItem('ProtectionClickCount') || '0') + 1
  clickCount > 3 && (BlacklistAccess(), (clickCount = 0))
  localStorage.setItem('ProtectionClickCount', clickCount.toString())
}

function checkBlacklist() {
  showProtectionLog()
  const storedBlacklist = JSON.parse(localStorage.getItem('Blacklist') || '[]')
  let isCurrentUrlBlacklisted = false
  storedBlacklist.forEach((listItem, itemIndex) => {
    if (listItem.url === window.location.href) {
      const itemExpiryDate = new Date(listItem.timeLimit),
        now = new Date()
      now < itemExpiryDate
        ? (isCurrentUrlBlacklisted = true)
        : (storedBlacklist.splice(itemIndex, 1),
          localStorage.setItem('Blacklist', JSON.stringify(storedBlacklist)))
    }
  })
  isCurrentUrlBlacklisted && showAlert()
}

function showProtectionLog() {
  console.log('애드센스 가드 %c무효 트래픽 감시 중\n무효 광고 클릭을 차단합니다.')
}

function showAlert() {
  alert('애드센스 무효 클릭 공격 감지되었습니다.\n IP를 수집합니다.')
  window.location.replace('https://www.tistory.com/')
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
  checkBlacklist()
})
