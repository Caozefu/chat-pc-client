export function getToken2(key) {
    let cookie = localStorage.getItem(key);
    return cookie || ''
}

export function getToken(key) {
    let cookies = document.cookie.split(';');
    let obj = {};
    cookies.forEach(item => {
        if (!item.trim()) return;
        let res = item.trim().split('=');
        obj[res[0].trim()] = res[1].trim();
    });
    return obj[key] || ''
}
