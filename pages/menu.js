import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Menu() {
  const router = useRouter();
  const [username, usernamed] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('username');
    if (saved) {
        usernamed(saved);
    }
  }, []);

  const roboto = () => {
    router.push('/roboto');
  };

  return (
    <>
    <div className='container'>
      <h1>TIC-TAC-TOGETHER</h1>

      <button className="nes-btn is-primary" onClick={roboto}>ROBOTO</button>
      <button className="nes-btn is-error">ONLINE</button>
      <button className="nes-btn is-success">FRIEND</button>
    </div>

    <div className='message'>
      <section className="message -right">
        <div className="nes-balloon from-right">
          <p>HELLO, {username}!</p>
        </div>
        <i className="nes-bcrikko"></i>
      </section>
    </div>
    </>
  );
}
