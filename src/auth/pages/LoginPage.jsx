import { useEffect } from "react";
import { useAuthStore, useForm } from "../../hooks";
import "./LoginPage.css";
import Swal from "sweetalert2";

const loginFormField = {
  loginEmail: "",
  loginPassword: "",
};

const registerFormField = {
  registerEmail: "",
  registerName: "",
  registerPassword: "",
  registerPasswordConfirm: "",
};

export const LoginPage = () => {
  const {
    loginEmail,
    loginPassword,
    onInputChange: onLoginInputChange,
  } = useForm(loginFormField);

  const {
    registerEmail,
    registerName,
    registerPassword,
    registerPasswordConfirm,
    onInputChange: onRegisterInputChange,
  } = useForm(registerFormField);

  const { startLogin, registerUser, errorMessage } = useAuthStore();

  useEffect(() => {
    if (errorMessage !== undefined) {
      Swal.fire("Error en la autenticacion", errorMessage, "error");
    }
  }, [errorMessage]);

  const logInSubmit = (event) => {
    event.preventDefault();

    startLogin({ email: loginEmail, password: loginPassword });
  };

  const registerSubmit = (event) => {
    event.preventDefault();

    if (registerPassword !== registerPasswordConfirm) {
      return Swal.fire("Error en la creacion", 'La contraseñas no coinciden', "error");
    }

    registerUser({
      name: registerName,
      email: registerEmail,
      password: registerPassword,
    });
  };

  return (
    <div className="container login-container">
      <div className="row">
        <div className="col-md-6 login-form-1">
          <h3>Ingreso</h3>
          <form onSubmit={logInSubmit}>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Correo"
                name="loginEmail"
                value={loginEmail}
                onChange={onLoginInputChange}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                name="loginPassword"
                value={loginPassword}
                onChange={onLoginInputChange}
              />
            </div>
            <div className="d-grid gap-2">
              <input type="submit" className="btnSubmit" value="Login" />
            </div>
          </form>
        </div>

        <div className="col-md-6 login-form-2">
          <h3>Registro</h3>
          <form onSubmit={registerSubmit}>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre"
                name="registerName"
                value={registerName}
                onChange={onRegisterInputChange}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="email"
                className="form-control"
                placeholder="Correo"
                name="registerEmail"
                value={registerEmail}
                onChange={onRegisterInputChange}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                name="registerPassword"
                value={registerPassword}
                onChange={onRegisterInputChange}
              />
            </div>

            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Repita la contraseña"
                name="registerPasswordConfirm"
                value={registerPasswordConfirm}
                onChange={onRegisterInputChange}
              />
            </div>

            <div className="d-grid gap-2">
              <input type="submit" className="btnSubmit" value="Crear cuenta" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
