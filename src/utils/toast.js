import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

const Toast = (text) => {
    Toastify({
        text: text,
        gravity: "top",
        position: 'center',
        backgroundColor: "#dc3545", // Default red
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)", // Override if needed
        }
    }).showToast();
}

export default Toast;
