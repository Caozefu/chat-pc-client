import {Message} from "element-ui";
import { remote } from 'electron'
const { Notification } = remote;

export function initNotice() {
    if (window.Notification) {
        if (Notification.permission != "denied") {
            //如果不是拒绝显示通知就请求允许显示通知
            Notification.requestPermission();
        }
    } else {
        Message.error('浏览器不支持桌面通知');
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

export function createNotice(name, icon, message) {
    const notify = new Notification({
        title: name,
        body: message
    });
    notify.show();
}
