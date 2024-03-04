import { useDispatch, useSelector } from "react-redux";
import {
  onAddNewEvent,
  onDeleteEvent,
  onSetActiveEvent,
  onUpdateEvent,
  onLoadEvents,
} from "../store";
import { calendarApi } from "../api";
import Swal from "sweetalert2";
import { eventDateConverter } from "../helpers";

export const useCalendarStore = () => {
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { user } = useSelector((state) => state.auth);

  const setActiveEvent = async (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  const startSavingEvent = async (calendarEvent) => {
    try {
      if (calendarEvent.id) {
        // Actualizando
        await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
        dispatch(onUpdateEvent({ ...calendarEvent, user }));
        return;
      }

      // Creando
      const { data } = await calendarApi.post("/events", calendarEvent);
      dispatch(
        onAddNewEvent({ ...calendarEvent, id: data.savedEvent.id, user })
      );
    } catch (error) {
      Swal.fire("Error al guardar", "", "error");
    }
  };

  const startDeletingEvent = async () => {
    try {
      await calendarApi.delete(`/events/${activeEvent.id}`);

      dispatch(onDeleteEvent());
    } catch (error) {
      Swal.fire("Error al borrar el evento", "", "error");
    }
  };

  const startLoadingEvent = async () => {
    try {
      const { data } = await calendarApi.get("/events");

      const parsedEvents = eventDateConverter(data.eventos);

      dispatch(onLoadEvents(parsedEvents));
    } catch (error) {
      console.log("ERROR CARGANDO EVENTOS", error);
    }
  };

  return {
    //* Propiedades
    activeEvent,
    events,
    hasEventSelected: !!activeEvent,

    //* Métodos
    startDeletingEvent,
    setActiveEvent,
    startSavingEvent,
    startLoadingEvent,
  };
};
