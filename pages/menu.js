import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Menu() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [clickCount, setClickCount] = useState(0); // To track clicks on the icon

  useEffect(() => {
    const saved = localStorage.getItem('username');
    if (saved) {
      setUsername(saved);
    }
  }, []);

  const roboto = () => {
    router.push('/roboto');
  };

  const handleIconClick = () => {
    setClickCount(prevCount => prevCount + 1);
    if (clickCount + 1 === 3) {
      document.getElementById('dialog-rounded').showModal();
    }
  };

  const handleNize = () => {
    setUsername('JABRONI');
    localStorage.setItem('username', 'JABRONI');
    document.getElementById('dialog-rounded').close();
  };

  const handleCalm = () => {
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
          <i className="nes-bcrikko" onClick={handleIconClick}></i>
        </section>
      </div>

      <dialog className="nes-dialog is-rounded" id="dialog-rounded">
        <form method="dialog">
          <p className="title">BUN OFF!</p>
          <menu className="dialog-menu">
            <button className="nes-btn is-success" onClick={handleCalm}>CALM</button>
            <button className="nes-btn is-error" onClick={handleNize}>NIZE</button>
          </menu>
        </form>
      </dialog>
    </>
  );
}
