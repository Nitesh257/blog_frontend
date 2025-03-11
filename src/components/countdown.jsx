import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";

const useCountdownToast = () => {
  const [countdown, setCountdown] = useState(null);
  const toastId = useRef(null); 
  let interval;

  const showToastWithTimer = (message, duration = 60) => {
    setCountdown(duration);

    toastId.current = toast.info(`${message} - ${duration}s remaining`, {
      autoClose: false,
      closeOnClick: false,
    });

    interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          dismissToast(); 
          return null;
        }
        toast.update(toastId.current, { render: `${message} - ${prev - 1}s remaining` });
        return prev - 1;
      });
    }, 1000);
  };

  const dismissToast = () => {
    clearInterval(interval);
    if (toastId.current !== null) {
      toast.dismiss(toastId.current);
      toastId.current = null; 
    }
    setCountdown(null);
  };

  useEffect(() => {
    return () => clearInterval(interval);
  }, []);

  return { showToastWithTimer, dismissToast };
};

export default useCountdownToast;
