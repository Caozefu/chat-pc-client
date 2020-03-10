import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import axios from '../http/axios'
import store from '../store'
import {Toast} from 'vant';

/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error=> error)
};

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        children: [
            {
                path: 'message',
                name: 'message',
                component: () => import('../views/message/index.vue')
            },
            {
                path: 'friends',
                name: 'friends',
                component: () => import('../views/friend/index.vue')
            },
            {
                path: 'setting',
                name: 'setting',
                component: () => import('../views/setting.vue')
            }
        ]
    },
    // Friend
    {
        path: '/search-friends',
        name: 'searchFriends',
        component: () => import('../views/friend/searchFriends.vue')
    },
    {
        path: '/friends-request',
        name: 'friendRequest',
        component: () => import('../views/friend/friendRequest.vue')
    },
    // Message
    {
        path: '/message-detail',
        name: 'messageDetail',
        component: () => import('../views/message/messageDetail.vue')
    },
    {
        path: '/setting-detail',
        name: 'settingDetail',
        component: () => import('../views/user/settingDetail.vue')
    },
    // Login / Register
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/user/register.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/user/login.vue')
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.name === 'register' || to.name === 'login') {
        next();
        return;
    }
    if (store.state.isLogin) {
        next();
    } else {
        axios.get('/api/getUserInfo')
            .then(res => {
                if (res.data.code === 200) {
                    store.commit('login', res.data.data);
                    next();
                } else {
                    Toast.fail('请先登陆');
                    store.commit('logout');
                    next('/login');
                }
            })
            .catch(() => {
                Toast.fail('请先登陆');
                next('/login');
            })
    }
});

export default router
