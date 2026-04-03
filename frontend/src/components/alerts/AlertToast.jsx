import { useEffect, useState } from "react";

export default function AlertToast({ alert, onClose }) {

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const getColor = () => {
    if (alert.severity === "HIGH") return "#ff4d4f";
    if (alert.severity === "WARNING") return "#fa8c16";
    return "#1890ff";
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: getColor(),
        color: "white",
        padding: "15px 20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
        zIndex: 9999,
        minWidth: "280px",
        animation: "slideIn 0.3s ease",
        
      }}
    >
      <strong>{alert.title}</strong>
      <div>{alert.message}</div>
    </div>
  );
}