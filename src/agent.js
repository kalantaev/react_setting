import {TYPES} from "./constants/function";

const agent = new XMLHttpRequest();
export const API_ROOT = 'http://localhost:8080/api';
// export const API_ROOT = 'http://37.140.198.217:8080';
const encode = encodeURIComponent;
const responseBody = res => res.body;


let request = obj => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.timeout = 5000;
        xhr.open(obj.method || "GET", obj.url);
        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        if (obj.url.indexOf("/setting") !== -1) {
            xhr.setRequestHeader("token", localStorage.getItem('jwtx'));
        }
        xhr.onload = () => {
            if (xhr.status === 401) {
                window.location.href = '/login';
                localStorage.clear()
            }
            console.info(1)
            let responseHeader = xhr.getResponseHeader("token");
            if (!!responseHeader) {
                localStorage.setItem('jwtx', responseHeader)
            }

            if (xhr.status >= 200 && xhr.status < 300) {
                (obj && obj.method && obj.method === 'DELETE') ? resolve() :
                    (obj.method && obj.method === 'POST') ? resolve(xhr.response ? {body: JSON.parse(xhr.response)} : {}) :
                        !!obj.notJson ? resolve(xhr.response) : resolve(JSON.parse(xhr.response));
            } else {
                console.info(xhr.response)
                reject(JSON.parse(xhr.response));
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(JSON.stringify(obj.body));
    });
};


let rqFile = (url, file) => {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.file = file; // not necessary if you create scopes like this
        xhr.addEventListener('progress', function (e) {
            var done = e.position || e.loaded, total = e.totalSize || e.total;
            // console.log('xhr progress: ' + (Math.floor(done / total * 1000) / 10) + '%');
        }, false);
        if (xhr.upload) {
            xhr.upload.onprogress = function (e) {
                var done = e.position || e.loaded, total = e.totalSize || e.total;
                // console.log('xhr.upload progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done / total * 1000) / 10) + '%');
            };
        }
        xhr.onreadystatechange = function (e) {
            if (4 == this.readyState) {
                // console.log(['xhr upload complete', e]);
            }
        };
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.open('post', url, true);
        // xhr.setRequestHeader("Content-Type", "multipart/form-data");
        xhr.send(file);
    });
};

const requests = {
    del: url =>
        request({url: `${API_ROOT}${url}`}).then(responseBody),
    get: (url, notJson) =>
        request({url: `${API_ROOT}${url}`, notJson: notJson})
            .then((responseBody) => {
                return responseBody;
            }).catch(er => {
            console.info(er);
            throw er
        }),
    put: (url, body) =>
        request({
            method: "PUT",
            url: `${API_ROOT}${url}`,
            body: body,
            headers: {"content-type": 'application/json'}
        }).then(responseBody),
    post: (url, body) =>
        request({
            method: "POST",
            url: `${API_ROOT}${url}`,
            body: body,
            headers: {'content-type': 'application/json'}
        }).then(responseBody),
    delete: (url) =>
        request({
            method: "DELETE",
            url: `${API_ROOT}${url}`
        }).then(() => {
        }),
    file: (url, body) =>
        rqFile(`${API_ROOT}${url}`, body)
};

const Auth = {
    current: () =>
        requests.get('/user'),
    login: (login, password) =>
        requests.post('/auth', {login, password}),
    register: (username, email, password) =>
        requests.post('/users', {user: {username, email, password}}),
    save: user =>
        requests.put('/user', {user})
};

const Tags = {
    getAll: () => requests.get('/tags')
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = article => Object.assign({}, article, {slug: undefined})
const Articles = {
    all: page =>
        requests.get(`/articles?${limit(10, page)}`),
    byAuthor: (author, page) =>
        requests.get(`/articles?author=${encode(author)}&${limit(5, page)}`),
    byTag: (tag, page) =>
        requests.get(`/articles?tag=${encode(tag)}&${limit(10, page)}`),
    del: slug =>
        requests.del(`/articles/${slug}`),
    favorite: slug =>
        requests.post(`/articles/${slug}/favorite`),
    favoritedBy: (author, page) =>
        requests.get(`/articles?favorited=${encode(author)}&${limit(5, page)}`),
    feed: () =>
        requests.get('/articles/feed?limit=10&offset=0'),
    get: slug =>
        requests.get(`/articles/${slug}`),
    unfavorite: slug =>
        requests.del(`/articles/${slug}/favorite`),
    update: article =>
        requests.put(`/articles/${article.slug}`, {article: omitSlug(article)}),
    create: article =>
        requests.post('/articles', {article})
};

const Image = {
    get: id =>
        requests.get(`/image/${id}`, true)
};

const Windows = {
    all: page =>
        requests.get(`/setting/getWindows`),
    get: id =>
        requests.get(`/setting/element/${id}`),
    save: data =>
        requests.post(`/setting/element/${data.id}`, data),
    saveNew: data =>
        requests.post(`/setting/element`, data),
    saveFile: data =>
        requests.file(`/file`, data),
    deleteFile: data =>
        requests.delete(`/setting/image/${data}`),
};

const Elements = {
    all: data => {
        if (data === TYPES.ELECTRO) {
            return requests.get(`/setting/getElectro`)
        } else {
            return requests.get(`/setting/getAll?type=${data}`)
        }
    },

    get: id =>
        requests.get(`/setting/element/${id}`),
    save: data =>
        requests.post(`/setting/element/${data.id}`, data),
    saveNew: data =>
        requests.post(`/setting/element`, data),
};
const Electro = {
    all: page =>
        requests.get(`/setting/getElectro`)
};

const Doors = {
    get: id =>
        requests.get(`/setting/element/${id}`),
    save: data =>
        requests.post(`/setting/element/${data.id}`, data),
    saveFile: data =>
        requests.file(`/file`, data),
    deleteFile: data =>
        requests.delete(`/image/${data}`),
};

const BaseConfig = {
    all: page =>
        requests.get(`/setting/base-config`),
    get: id =>
        requests.get(`/setting/base-config/${id}`),
    changePostedBaseConfig: id =>
        requests.get(`/setting/base-config/${id}/posted`, true),
    deleteBaseConfig: id =>
        requests.delete(`/setting/base-config/${id}`),
    save: data =>
        requests.post(`/setting/base-config/${data.id}`, data),
    saveNew: data =>
        requests.post(`/setting/base-config`, data),
    saveFile: data =>
        requests.file(`/file`, data),
    deleteFile: data =>
        requests.delete(`/image/${data}`),
};

const Settings = {
    all: page =>
        requests.get(`/setting/getSettings`),
    save: data =>
        requests.post(`/setting/saveSettings`, data),
}

const Comments = {
    create: (slug, comment) =>
        requests.post(`/articles/${slug}/comments`, {comment}),
    delete: (slug, commentId) =>
        requests.del(`/articles/${slug}/comments/${commentId}`),
    forArticle: slug =>
        requests.get(`/articles/${slug}/comments`)
};

const Profile = {
    follow: username =>
        requests.post(`/profiles/${username}/follow`),
    get: username =>
        requests.get(`/profiles/${username}`),
    unfollow: username =>
        requests.del(`/profiles/${username}/follow`)
};

export default {
    Articles,
    Windows,
    Doors,
    Elements,
    Auth,
    Settings,
    Image,
    Electro,
    BaseConfig,
    Comments,
    Profile,
    Tags,
    setToken: _token => {
    }
};
