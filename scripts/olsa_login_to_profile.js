// Creator: k6 Browser Recorder 0.6.2

import { sleep, group, check } from "k6";
import http from "k6/http";
import { Trend } from "k6/metrics";
// import {BASE_URL, idTokenKey} from './config'
const STAGE = `dev`;
const idTokenKey = "idToken";
const BASE_URL = `https://olsaapi.shadintech.com/${STAGE}`;

const userEmail = "hovojo4793@petloca.com";
const userPassword = "Asdfg1";
const userId = "0e97d6bf48004260957ac1df1bf1592638c2d5ee";

const userLoginData = {
    medium: "email",
    emailOrPhone: userEmail,
    password: userPassword,
};

// import jsonpath from "https://jslib.k6.io/jsonpath/1.0.2/index.js";

const signinTrend = new Trend("custom.signing_duration");
const getProfileTrend = new Trend("custom.get_profile_duration");

export const options = {
    vus: 20,
    duration: "5m",
    thresholds: {
        http_req_failed: ["rate<0.01"], // http errors should be less than 1%
        http_req_duration: ["p(95)<600"], // 95% of requests should be below 200ms
    },
};

const path = {
    signin: `${BASE_URL}/auth/authentication/signin`,
    getUserDetails: (userId) => `${BASE_URL}/auth/users/${userId}`,
    getUserProfile: (userId, qString) => `${BASE_URL}/profile/users/profile/${userId}?query=${qString}`,
};

export default function main() {
    let response;

    const vars = {};

    const optionsHeader = {
        accept: "*/*",
        "access-control-request-headers": "authorization",
        "access-control-request-method": "GET",
        origin: "https://olsaclientdev.shadintech.com",
        "sec-fetch-mode": "cors",
    };
    group("OLsA login to profile - https://olsaclientdev.shadintech.com/", function () {
        response = http.post(path.signin, JSON.stringify(userLoginData), {
            headers: {
                accept: "application/json, text/plain, */*",
                "accept-language": "en",
                authorization: "Bearer",
                "content-type": "application/json",
                "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="101"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Linux"',
            },
        });

        check(response, {
            "Signing in successful": (res) => {
                const jsObj = JSON.parse(res.body);
                return jsObj.message === "Sign in successful";
            },
            "User data is not empty": (res) => {
                const jsObj = JSON.parse(res.body);
                return jsObj.data !== {};
            },
            "User idToken is not empty": (res) => {
                const jsObj = JSON.parse(res.body);
                const isValidIdToken = jsObj.data.idToken !== "";
                if (isValidIdToken) {
                    vars[idTokenKey] = jsObj.data.idToken;
                    return true;
                }
                return false;
            },
        });

        signinTrend.add(response.timings.duration);

        response = http.options(path.signin, null, {
            headers: optionsHeader,
        });
        sleep(6.9);

        response = http.get(path.getUserDetails(userId), {
            headers: getHeaders(vars),
        });

        check(response, {
            "check email is correct": (res) => {
                const jsObj = JSON.parse(res.body);
                return jsObj.data.email === userLoginData.emailOrPhone;
            },
        });

        getProfileTrend.add(response.timings.duration);
        response = http.get(path.getUserDetails(userId), {
            headers: getHeaders(vars),
        });

        getProfileTrend.add(response.timings.duration);

        response = http.options(path.getUserDetails(userId), null, {
            headers: optionsHeader,
        });

        getProfileTrend.add(response.timings.duration);

        response = http.options(path.getUserDetails(userId), null, {
            headers: optionsHeader,
        });
        getProfileTrend.add(response.timings.duration);
        sleep(1.4);

        response = http.get(path.getUserDetails(userId), {
            headers: getHeaders(vars),
        });

        getProfileTrend.add(response.timings.duration);

        response = http.get(path.getUserProfile(userId, "profile"), {
            headers: getHeaders(vars),
        });

        response = http.get(path.getUserProfile(userId, "contacts"), {
            headers: getHeaders(vars),
        });

        response = http.get(path.getUserProfile(userId, "educations"), {
            headers: getHeaders(vars),
        });

        response = http.get(path.getUserProfile(userId, "addresses"), {
            headers: getHeaders(vars),
        });

        response = http.get(path.getUserProfile(userId, "voluntary_acts"), {
            headers: getHeaders(vars),
        });

        response = http.get(path.getUserProfile(userId, "families"), {
            headers: getHeaders(vars),
        });

        response = http.get(path.getUserProfile(userId, "children"), {
            headers: getHeaders(vars),
        });

        response = http.options(path.getUserDetails(userId), null, {
            headers: optionsHeader,
        });

        response = http.get(path.getUserProfile(userId, "spouses"), {
            headers: getHeaders(vars),
        });

        response = http.get(`${BASE_URL}/profile/users/list_user_experience/0e97d6bf48004260957ac1df1bf1592638c2d5ee`, {
            headers: getHeaders(vars),
        });

        response = http.options(path.getUserProfile(userId, "profile"), null, {
            headers: optionsHeader,
        });

        response = http.options(path.getUserProfile(userId, "contacts"), null, {
            headers: optionsHeader,
        });

        response = http.options(path.getUserProfile(userId, "educations"), null, {
            headers: optionsHeader,
        });

        response = http.options(path.getUserProfile(userId, "addresses"), null, {
            headers: optionsHeader,
        });

        response = http.options(path.getUserProfile(userId, "voluntary_acts"), null, {
            headers: optionsHeader,
        });

        response = http.options(path.getUserProfile(userId, "families"), null, {
            headers: optionsHeader,
        });

        response = http.options(path.getUserProfile(userId, "children"), null, {
            headers: optionsHeader,
        });

        response = http.options(path.getUserProfile(userId, "spouses"), null, {
            headers: optionsHeader,
        });

        response = http.options(
            `${BASE_URL}/profile/users/list_user_experience/0e97d6bf48004260957ac1df1bf1592638c2d5ee`,
            null,
            {
                headers: optionsHeader,
            }
        );
        sleep(1.1);
    });
}
function getHeaders(vars) {
    return {
        accept: "application/json, text/plain, */*",
        "accept-language": "en",
        authorization: `Bearer ${vars[idTokenKey]}`,
        "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="101"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
    };
}
