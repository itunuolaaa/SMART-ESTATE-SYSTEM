import { useState } from "react";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await API.post("/auth/login", {
//         email,
//         password,
//       });

//       console.log(response.data);

//       alert("Login successful!");
//     } catch (error) {
//       console.error(error);
//       alert("Login failed!");
//     }
//   };

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>Login</h2>

//       <form onSubmit={handleLogin}>
//         <div>
//           <input
//             type="email"
//             placeholder="Enter email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         <br />

//         <div>
//           <input
//             type="password"
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>

//         <br />

//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await API.post("/auth/login", {
      email,
      password,
    });

    console.log("SUCCESS:", response.data);
    alert("Login success!");
  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);
    alert("Login failed!");
  }
};
}