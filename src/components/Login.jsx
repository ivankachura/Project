import React, {useState} from "react";
import axios from "axios";
import {API_LOGIN, handler} from "../timer";
import krest from "../assets/img/krest.svg"

function Login({ state }) {
    const [loginLogin, setLoginLogin] = useState("")
    const [loginPass, setLoginPass] = useState("")
    const [signupEmail, setSignupEmail] = useState("")
    const [signupLogin, setSignupLogin] = useState("")
    const [signupPass, setSignupPass] = useState("")
    function login() {
        axios({
            method: 'post',
            url: API_LOGIN + "token",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                username: loginLogin,
                password: loginPass
            }
        })
            .then(function (response) {
                localStorage.setItem("token", response.data.access_token)
                state(false)
                alert("ВЫ ВОШЛИ!!!!!")
                window.location.reload()
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    function signup() {
        let mailformat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if(!signupEmail.match(mailformat))
        {
            alert("Почта не соответствует!");
            return;
        }
        axios({
            method: 'post',
            url: API_LOGIN + "register",
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                email: signupEmail,
                username: signupLogin,
                password: signupPass
            }
        })
            .then(function (response) {
                alert("Вы успешно засусались!!!!!")
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    return (
        <div className="back">
            <div className="login">
                <img onClick={() => state(false)} src={krest} alt="cross"/>
                <div className="log_block">
                    <p className="head">Войти</p>
                    <input value={loginLogin} onChange={(e) => handler(e, setLoginLogin)} type="text" name="login" placeholder="Логин"/>
                    <input value={loginPass} onChange={(e) => handler(e, setLoginPass)} type="password" name="pass" placeholder="Пароль"/>
                    <button onClick={login}>Войти</button>
                </div>
                <div className="log_block">
                    <p className="head">Регистрация</p>
                    <input value={signupEmail} onChange={(e) => handler(e, setSignupEmail)} type="text" name="email" placeholder="Почта"/>
                    <input value={signupLogin} onChange={(e) => handler(e, setSignupLogin)} type="text" name="login" placeholder="Логин"/>
                    <input value={signupPass} onChange={(e) => handler(e, setSignupPass)} type="password" name="pass" placeholder="Пароль"/>
                    <button onClick={signup}>Зарегистрироваться</button>
                </div>
            </div>
        </div>
    );
}

export default Login