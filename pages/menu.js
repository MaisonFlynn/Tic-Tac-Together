import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Menu() {
  const router = useRouter();
  const [username, usernamed] = useState('');
  const [click, clicked] = useState(0); // Track Icon Click(s)

  useEffect(() => {
    const saved = localStorage.getItem('username');
    if (saved) {
      usernamed(saved);
    }
  }, []);

  const roboto = () => {
    router.push('/roboto');
  };

  // Easter Egg
  const clicker = () => {
    clicked(count => count + 1);
    if (click + 1 === 3) {
      document.getElementById('dialog-rounded').showModal();
    }
  };

  const nize = () => {
    usernamed('JABRONI');
    localStorage.setItem('username', 'JABRONI');
    document.getElementById('dialog-rounded').close();
  };

  const calm = () => {
    document.getElementById('dialog-rounded').close();
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
            <p>{username === 'JABRONI' ? 'TSK' : `OI, ${username}!`}</p>
          </div>
          <i className="nes-bcrikko" onClick={clicker}></i>
        </section>
      </div>

      <dialog className="nes-dialog is-rounded" id="dialog-rounded">
        <form method="dialog">
          <p className="title">BUN OFF!</p>
          <menu className="dialog-menu">
            <button className="nes-btn is-success" onClick={calm}>CALM</button>
            <button className="nes-btn is-error" onClick={nize}>NIZE</button>
          </menu>
        </form>
      </dialog>
    </>
  );
}
