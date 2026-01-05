// YouTubeトップページ判定
function isHomePage() {
	return window.location.pathname === "/";
}
let isInitialized = false;
let dismissiblePollId = null;

// ショートコンテンツを非表示にする関数
function hideShorts() {
	if (isHomePage()) {
		// ホーム表示の場合
		const dismissibleElements = document.querySelectorAll("#dismissible");
		dismissibleElements.forEach((element) => {
			element.style.display = "none";
		});
	} else {
		// ホーム以外の場合
		// badge-shapeタグを探す
		const badgeElements = document.querySelectorAll(
			'badge-shape[aria-label="ショート"]'
		);

		badgeElements.forEach((badge) => {
			// 親ノードをさかのぼってytd-video-rendererを探す
			let currentElement = badge;
			while (
				currentElement &&
				currentElement.tagName.toLowerCase() !== "ytd-video-renderer"
			) {
				currentElement = currentElement.parentElement;
			}

			// ytd-video-rendererが見つかった場合、非表示にする
			if (currentElement) {
				currentElement.style.display = "none";
			}
		});
	}
}

// ミニプレーヤーを削除する（全ページ対象）
function removeMiniPlayer() {
	const miniPlayerElements = document.querySelectorAll("ytd-miniplayer");
	miniPlayerElements.forEach((element) => {
		element.remove();
	});
}

// スクロールイベントにリスナーを追加
window.addEventListener("scroll", function () {
	console.log('scrolled')
	// スクロール中にパフォーマンスを考慮して、少し遅延させて実行
	setTimeout(function () {
		hideShorts();
	}, 300);
});

// ページ読み込み時にショートを非表示にする
function startDismissiblePolling() {
	if (!isHomePage()) {
		if (dismissiblePollId !== null) {
			clearInterval(dismissiblePollId);
			dismissiblePollId = null;
		}
		return;
	}

	if (dismissiblePollId !== null) {
		clearInterval(dismissiblePollId);
		dismissiblePollId = null;
	}

	const startTime = Date.now();
	const pollIntervalMs = 500;
	const maxWaitMs = 10000;
	dismissiblePollId = setInterval(function () {
		const dismissible = document.querySelector("#dismissible");
		if (dismissible) {
			hideShorts();
			clearInterval(dismissiblePollId);
			dismissiblePollId = null;
			return;
		}

		if (Date.now() - startTime >= maxWaitMs) {
			clearInterval(dismissiblePollId);
			dismissiblePollId = null;
		}
	}, pollIntervalMs);
	console.log('initialized');
}

// ページ切替処理
function handlePageChange() {
	hideShorts();
	startDismissiblePolling();
}

// 初期ロード時にも実行
document.addEventListener("DOMContentLoaded", function () {
	setTimeout(function () { handlePageChange(); }, 500);
});

// YouTubeのSPA遷移に対応
document.addEventListener("yt-navigate-finish", function () {
	handlePageChange();
});

// MutationObserverを使用して、DOMの変更を監視
const observer = new MutationObserver(function () {
	removeMiniPlayer();
});
observer.observe(document.body, { childList: true, subtree: true });
