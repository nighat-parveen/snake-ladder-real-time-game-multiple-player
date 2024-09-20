import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Register = () => {
    const navigate = useNavigate();
    const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/register', { email, password, username });
      localStorage.setItem('token', res.data.token);  // Save token in localStorage
      setError('');
      navigate('/login')
      // Redirect user to game page
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleLogin}>
        <input
        type="text"
        defaultValue={email}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="email"
        defaultValue={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        defaultValue={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Register;
