import React, { useEffect } from 'react'
import SnakeLadderGame from './SnakeLadderGame'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const GameAuthenticate = () => {
    const navigate = useNavigate();
    useEffect(() => {
            console.log("check");
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
            }else {
                // if token is expired
                const decoded = jwtDecode(token) as any;
                console.log(decoded);
                if((decoded?.exp * 1000) < Date.now()) {
                    localStorage.remove
                    navigate('/login');
                }
            }
    }, [navigate]);
  return (
    <div>
        hello GameAuthentication done
      <button onClick={() => navigate('/start-game')}>Start Game</button>
      {/* <SnakeLadderGame /> */}
    </div>
  )
}

export default GameAuthenticate
