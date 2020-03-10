import {Toast} from "vant";

export function initNotice() {
    if (window.Notification) {
        if (Notification.permission != "denied") {
            //如果不是拒绝显示通知就请求允许显示通知
            Notification.requestPermission();
        }
    } else {
        Toast.fail('浏览器不支持桌面通知');
    }

}

export function pushNotice(name, icon, message) {
    //判断是否有显示通知的权限
    if (Notification.permission == "granted") {
        //初始化通知对象
        let options = {
            body: message,
            icon
        };
        let notice = new Notification(name, options);
        console.log(notice)
    }
}
