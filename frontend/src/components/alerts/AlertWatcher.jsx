import { useEffect, useState } from "react";
import AlertToast from "./AlertToast";

export default function AlertWatcher() {

  const [toastAlert, setToastAlert] = useState(null);
  const [lastAlertId, setLastAlertId] = useState(null);

  useEffect(() => {

    const interval = setInterval(async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8080/api/alerts", {
        headers: {
            Authorization: `Bearer ${token}`
        }
        })

        const alerts = await res.json();

        if (alerts.length === 0) return;

        const newest = alerts[0];

        if (newest.id !== lastAlertId) {

          setToastAlert(newest);
          setLastAlertId(newest.id);

        }

      } catch (err) {
        console.error("Alert fetch error", err);
      }

    }, 5000); // check every 5 seconds

    return () => clearInterval(interval);

  }, [lastAlertId]);

  return (
    <>
      {toastAlert && (
        <AlertToast
          alert={toastAlert}
          onClose={() => setToastAlert(null)}
        />
      )}
    </>
  );
}