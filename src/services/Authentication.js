import { appInsights } from './Logger'
import { LOGIN_ERROR } from '../constants/constants'

export class auth {
    login(username, password) {
        return fetch("https://carpoolapi.azurewebsites.net/api/Auth", {
            method: 'post',
            body: `{'username': '${username}','password': '${password}'}`,
            headers: new Headers({'content-type': 'application/json'}),
        })
        .then((resp) => resp.json())
        .then(function(response) {
            localStorage.setItem("auth_token", response.token)
            localStorage.setItem("auth_token_expires", response.expiration)
            localStorage.setItem("username", username)
            localStorage.setItem("isAuthed", true)
            appInsights.trackEvent({name: 'user_login'})
            return true
        })
        .catch(function() {
            appInsights.trackEvent({name: `Failed to authenticate user ${username}` })
            return LOGIN_ERROR
        });
    }

    logout() {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_token_expires")
        localStorage.removeItem("username")
        localStorage.removeItem("isAuthed")
        appInsights.trackEvent({name: 'user_logout'})

    }

    isAuthenticated() {
        let expires = localStorage["auth_token_expires"]

        if (expires === undefined) {
            return false;
        }
        
        // new Date().getTime() returns utc
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime
        return Date.parse(expires) >  new Date().getTime()
    }

    getCachedToken() {
        if (!this.isAuthenticated()) {
            alert("You need to login first")
            return null;
        } else {
            return localStorage["auth_token"]
        }
    }
}