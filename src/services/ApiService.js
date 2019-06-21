import { auth } from "./Authentication";
import { appInsights } from "./Logger";

export class Api {

    static apiUrl = 'https://carpoolapi.azurewebsites.net/api/'   // PROD
    //static apiUrl = 'https://carpoolapi-dev.azurewebsites.net/api/' // DEV

    // Call to get a user
    getUser() {
        const token = new auth().getCachedToken();

        if (token != null) {
            let username = localStorage.getItem("username");
            let uri = encodeURI(`${Api.apiUrl}Users/email?email=${username}`);
            return fetch(uri, { headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
              })})
            .then((resp) => resp.json())
            .then(function(response) {
                return response;
            })
            .catch(function() {
                appInsights.trackPageView({name: `Failed to get user ${username}` });
            });
        }
    }

    // Get All Carpools
    getAllCarpools() {
        const token = new auth().getCachedToken();

        if (token != null) {
            let uri = encodeURI(`${Api.apiUrl}Carpool/all`);
            return fetch(uri, { headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
              })})
            .then((resp) => resp.json())
            .then(function(response) {
                return response;
            })
            .catch(function() {
                appInsights.trackPageView({name: `Failed to get carpools.` });
            });
        }
    }

    // Call to get a carpool by ID
    getCarpoolById({ id }) {
        const token = new auth().getCachedToken();

        if (token != null) {
            let uri = encodeURI(`${Api.apiUrl}Carpool/id?id=${id}`);

            return fetch(uri, { headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
              })})
            .then((resp) => resp.json())
            .then(function(response) {
                return response;
            })
            .catch(function() {
                appInsights.trackPageView({name: `Failed to get carpool ${id}` });
            });
        }
    }

    // Send Carpool Request
    sendCarpoolAction(payload) {
        const token = new auth().getCachedToken();

        if (token != null) {
            let uri = encodeURI(`${Api.apiUrl}Carpool/actionRequest`);
            return fetch(uri,
            {
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }),
                method: 'POST',
                body: JSON.stringify(payload)
            })
            .then((resp) => resp.json())
            .then(function(response) {
                return response;
            })
            .catch(function() {
                appInsights.trackPageView({name: `Failed to get submit request` });
            });
        }
    }

    // Create User Action
    // No Auth Needed
    createUser(payload) {
        let uri = encodeURI(`${Api.apiUrl}Users/createProfile`);
        return fetch(uri,
        {
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then((resp) => resp.json())
        .then(function(response) {
            return response;
        })
        .catch(function() {
            appInsights.trackPageView({name: `Failed to create user` });
        });
    }

    createCarpool(payload) {
        const token = new auth().getCachedToken();

        if (token != null) {
            let uri = encodeURI(`${Api.apiUrl}Carpool/createcarpool`);
            return fetch(uri,
            {
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }),
                method: 'POST',
                body: JSON.stringify(payload)
            })
            .then((resp) => resp.json())
            .then(function(response) {
                return response;
            })
            .catch(function() {
                appInsights.trackPageView({name: `Failed to get create a carpool` });
            });
        }
    }
}

