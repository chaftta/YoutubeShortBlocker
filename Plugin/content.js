// ショートコンテンツを非表示にする関数
function hideShorts() {
	// badge-shapeタグを探す
	const badgeElements = document.querySelectorAll('badge-shape[aria-label="ショート"]');
	
	badgeElements.forEach(badge => {
	  // 親ノードをさかのぼってytd-video-rendererを探す
	  let currentElement = badge;
	  while (currentElement && currentElement.tagName.toLowerCase() !== 'ytd-video-renderer') {
		currentElement = currentElement.parentElement;
	  }
	  
	  // ytd-video-rendererが見つかった場合、非表示にする
	  if (currentElement) {
		currentElement.style.display = 'none';
	  }
	});
  }
  
  // YouTubeトップページ判定
  const isHomePage = window.location.pathname === '/';
  
  // トップページのスクロール時にdismissibleを非表示にする
  function hideDismissibleOnHome() {
	if (!isHomePage) {
	  return;
	}
	
	const dismissibleElements = document.querySelectorAll('#dismissible');
	dismissibleElements.forEach(element => {
	  element.style.display = 'none';
	});
  }
  
  // スクロールイベントにリスナーを追加
  window.addEventListener('scroll', function() {
	// スクロール中にパフォーマンスを考慮して、少し遅延させて実行
	setTimeout(hideShorts, 300);
	setTimeout(hideDismissibleOnHome, 300);
  });
  
  // 初期ロード時にも実行
  document.addEventListener('DOMContentLoaded', function() {
	hideShorts();
	hideDismissibleOnHome();
  });
  
  // YouTubeは動的にコンテンツを読み込むため、定期的に確認
  setInterval(hideShorts, 2000);
  
  // MutationObserverを使用して、DOMの変更を監視
  const observer = new MutationObserver(function() {
	hideShorts();
	hideDismissibleOnHome();
  });
  observer.observe(document.body, { childList: true, subtree: true });
