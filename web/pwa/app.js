if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker 注册成功:', registration.scope);

                // 监听 updatefound 事件
                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                // 显示更新提示
                                alert('新版本可用，请刷新页面以更新。');
                                // 提供更新选项
                                const confirmUpdate = confirm('是否立即更新？');
                                if (confirmUpdate) {
                                    if (registration.waiting) {
                                        registration.waiting.postMessage({ type: 'SKIP_WAITING' });

                                        // 监听 controllerchange 事件
                                        navigator.serviceWorker.addEventListener('controllerchange', () => {
                                            window.location.reload();
                                        });
                                    }
                                }
                            } else {
                                // 第一次安装
                            }
                        }
                    };
                };

                // 接收来自Service Worker的消息
                navigator.serviceWorker.addEventListener('message', event => {
                    if (event.data.type === 'UPDATE_AVAILABLE') {
                        alert('新版本可用，请刷新页面以更新。');
                        // 提供更新选项
                        const confirmUpdate = confirm('是否立即更新？');
                        if (confirmUpdate) {
                            if (registration.waiting) {
                                registration.waiting.postMessage({ type: 'SKIP_WAITING' });

                                // 监听 controllerchange 事件
                                navigator.serviceWorker.addEventListener('controllerchange', () => {
                                    window.location.reload();
                                });
                            }
                        }
                    }
                });
            })
            .catch(error => {
                console.error('Service Worker 注册失败:', error);
            });
    });
}