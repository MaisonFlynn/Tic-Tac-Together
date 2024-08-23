import { useEffect, useState } from 'react';

export default function Menu() {
  const [username, usernamed] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('username');
    if (saved) {
        usernamed(saved);
    }
  }, []);

  return (
    <>
    <div className='container'>
      <h1>TIC-TAC-TOGETHER</h1>

      <button className="nes-btn is-primary">ROBOTO</button>
      <button className="nes-btn is-error">ONLINE</button>
      <button className="nes-btn is-success">FRIEND</button>
    </div>

    <div className='message'>
      <section class="message -right">
        <div class="nes-balloon from-right">
          <p>HELLO, {username}!</p>
        </div>
        <i class="nes-bcrikko"></i>
      </section>
    </div>
    </>
  );
}
