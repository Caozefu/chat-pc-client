export function scrollAnimation(targetY) {
    // 获取当前位置方法
    const _currentTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (_currentTop > targetY) return;

    // 计算需要移动的距离
    let needScrollTop = targetY;
    let _currentY = _currentTop;

    function run(target) {
        // 一次调用滑动帧数，每次调用会不一样
        const dist = Math.ceil(needScrollTop / 50);
        _currentY += dist;
        window.scrollTo(0, _currentY);
        // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
        if (needScrollTop - _currentY > 10 || needScrollTop - _currentY < -10) {
            setTimeout(run, 1, target);
        } else {
            window.scrollTo(0, target)
        }
    }

    setTimeout(run, 1, targetY)
}
