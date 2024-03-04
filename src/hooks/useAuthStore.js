import { useDispatch, useSelector } from "react-redux";
import { calendarApi } from "../api";
import {
  onChecking,
  onLogin,
  onLogout,
  clearErrorMessage,
  onLogoutCalendar,
} from "../store";

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector((state) => state.auth);
  const dispacth = useDispatch();

  const startLogin = async ({ email, password }) => {
    dispacth(onChecking());

    try {
      const { data } = await calendarApi.post("/auth", { email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());

      dispacth(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      dispacth(onLogout("Credenciales incorrectas"));
      setTimeout(() => {
        dispacth(clearErrorMessage());
      }, 10);
    }
  };

  const registerUser = async ({ name, email, password }) => {
    try {
      const { data } = await calendarApi.post("auth/new", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());

      dispacth(onLogin({ name: data.name, uid: data.uid }));
    } catch ({ response }) {
      dispacth(onLogout(response.data.msg || "Error en la creacion"));
      setTimeout(() => {
        dispacth(clearErrorMessage());
      }, 10);
    }
  };

  const checkAuthToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return dispacth(onLogout());
    }

    try {
      const { data } = await calendarApi.get("/auth/renew");
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispacth(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      localStorage.clear();
      return dispacth(onLogout());
    }
  };

  const startLogOut = () => {
    localStorage.clear();
    dispacth(onLogout());
    dispacth(onLogoutCalendar());
  };

  return {
    status,
    user,
    errorMessage,
    startLogin,
    registerUser,
    checkAuthToken,
    startLogOut,
  };
};
